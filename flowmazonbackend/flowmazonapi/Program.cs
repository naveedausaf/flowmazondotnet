using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Threading.Tasks;

using flowmazonapi;
using flowmazonapi.Domain;
using flowmazonapi.Handlers;
using flowmazonapi.BusinessLogic;
using flowmazonapi.BusinessLogic.ProductService;

using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using OpenTelemetry.Logs;



var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();

}

builder.Services.AddProblemDetails();

//////////////////////////////////////////////////////
//Initialise Otel SDK and the instrumentation libraries
//////////////////////////////////////////////////////

// Note that in code below we initialise OtlpExporter
// for each of the local pipelines for the three
// Otel signals (logs, traces, metrics) BUT did not
// pass in the OTLP endpoint or the protocol to use.
// These would be configured by environment variables,
// (as described here: https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/#endpoint-configuration)
//
// OTEL_EXPORTER_OTLP_ENDPOINT
// and
// OTEL_EXPORTER_OTLP_PROTOCOL
// and, token for GRafana Cloud or other observability backend that requries an authentication token
// OTEL_EXPORTER_OTLP_HEADERS
//
// The SDK reads these automatically.

// Extension method of IServiceCollection to
// initialise Otel SDK
builder.Services.AddOpenTelemetry()
    //configure attributes of the Resource
    // that describes this Service (i.e. 
    // described this API)
    // See details of what a Resource is:
    // https://opentelemetry.io/docs/languages/dotnet/resources/

    //and the semantic conventions, i.e. standardised attribute names, that apply to a Resource:
    // https://opentelemetry.io/docs/specs/semconv/resource/
    .ConfigureResource(resource =>
    {
        //add service.* attributes on the resource
        resource.AddService(
            serviceName: OtelConsts.ServiceName,
            serviceNamespace: OtelConsts.ServiceNamespace,

            //see my FreeCodeCamp post:
            //https://www.freecodecamp.org/news/set-semantic-versioning-for-net/
            serviceVersion: Assembly.GetEntryAssembly()?.
  GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.
  InformationalVersion);

        //deployment.environment.name to be set
        //by OTEL_RESOURCE_ATTRIBUTES="deployment.environment.name=<see individual environment definitions>"


    })
    .WithMetrics(
        metrics =>
        {
            //enable metrics autoinstrumentations
            //provided by added instrumentation libraries
            metrics.AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation();

            //Entity Framework Core instumentation library
            //does not have any metrics to initialise

            //set OtlpExporter as the metrics exporter
            //as both Aspire and remote observability
            //backend expose an OTLP ingestion endpoint
            metrics.AddOtlpExporter();
        }
    )
    //build up SDKs signal processing pipelines
    .WithTracing(tracing =>
    {

        //enable tracing autoinstrumentations
        //provided by added instrumentation libraries
        tracing.AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation();

        //configure OTLP exporter as the tracing exporter
        tracing.AddOtlpExporter();

    });

// To initialise Otel's Logging pipeline, instead of
// appending .WithLogging to builder.Services.AddOpenTelemetry()
// which we probably could have done, we instead set up
// Otel's logging provider in standard .NET logging.
//
// This allows us to write .NET Core logs as normal - with 
// good things like source generators introduced in .NET 7 -
// and these would get written out as Otel logs. 

// Also, if a log is written while a span is in progress 
// (Activity.Current would not be null) then the log would
// automatically be attached to that span.
builder.Logging.AddOpenTelemetry(
    //configure the logging pipeline (only exporter
    //need to be configured)
    logging =>
    {
        //it would be nice to be able to see the complete
        //parameter value-substituted, log message in the
        //observability backend:
        logging.IncludeFormattedMessage = true;

        // I am not not setting logging.IncludeLogScopes=true
        // as I do not intend to use Log Scope. 
        // They would unneessarily complicate telemetry 
        // given that we already have traces which may be 
        // seen as scoped logs, plus any (semantic) log 
        // we do write would automatically be attached to
        // the current span if there is one in context 
        // (i.e. Activity.Current != null) so we have that 
        // extra level of richness.

        //configure exporter for Otel SDK's logging pipeline
        logging.AddOtlpExporter();
    }
);

string? connString = null;
if (!builder.Environment.IsEnvironment(ConfigConsts.UnitTestingEnvironmentName))
{
    connString = builder.Configuration.GetConnectionString("FlowmazonDB") ?? throw new InvalidOperationException("Connection string 'FlowmazonDB' is not configured.");

    builder.Services.AddDbContext<FlowmazonDbContext>(
        options =>
        {
            options.UseNpgsql(connString);
            if (builder.Environment.IsDevelopment())
            {
                options.EnableSensitiveDataLogging();
            }

        }
    );

}

// builder.Services.AddScoped(typeof(FluentValidation.IValidator<Product>), typeof(ProductValidator));
// builder.Services.AddScoped(typeof(FluentValidation.IValidator<CreateProductArgs>), typeof(CreateProductArgsValidator));

builder.Services.AddValidatorsFromAssemblyContaining<ProductValidator>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
    {
        options.SupportNonNullableReferenceTypes();
        options.SwaggerDoc("v1", new OpenApiInfo()
        {
            Title = "Flowmazon API",
            Description = "API for Flowmazon, the next greatest online shopping destination",
            Version = "v1"
        });

        var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

        options.SchemaFilter<HttpValidationProblemFilter>();

    }
);


const string CORSPolicyName = "ProductionCORSPolicy";



var corsOrigins = builder.Configuration.GetValue<string>(ConfigConsts.CORSConfigKey);

if (string.IsNullOrWhiteSpace(corsOrigins))
{
    //TODO: add test for this
    //TODO: log this as Otel log
    throw new InvalidOperationException($"{ConfigConsts.CORSConfigKey} configuration value is not set.");
}

var origins = corsOrigins.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
if (origins.Length == 0)
{
    //TODO: add test for this
    //TODO: log this as Otel log
    throw new InvalidOperationException($"{ConfigConsts.CORSConfigKey} configuration value is empty.");
}
//TODO: OTel Log the origins


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CORSPolicyName,
        policy =>
        {

            //TODO: add test for this
            //TODO: log this as Otel log

            policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();


        });
});


const string DatabaseHealthCheckName = "DatabaseHealthCheck";
const string ApplicationLifecycleHealthCheckName = "ApplicationLifecycleHealthCheck";

if (!builder.Environment.IsEnvironment(ConfigConsts.UnitTestingEnvironmentName))
{
    builder.Services.AddHealthChecks()
        .AddNpgSql(connString, tags: [DatabaseHealthCheckName])

        // From the documentation (https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection.commonhealthchecksextensions.addapplicationlifecyclehealthcheck?view=net-9.0-pp), it is worth adding even if there are not IHostedService or IHostedLifecycleService (that exposes CheckHealthAsync method) registered wth build.Services.
        //also see:
        //https://learn.microsoft.com/en-us/dotnet/core/diagnostics/diagnostic-health-checks#application-lifetime-health-checks
        // This will ensure that the health check endpoint is healthy as long as the application is running, Unhealthy if it is shutting down or if it is still starting up)
        .AddApplicationLifecycleHealthCheck([ApplicationLifecycleHealthCheckName]);

}
var app = builder.Build();

app.Logger.LogInformation("Built the WebApplication with builder.Build() call");

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}

app.UseRouting();

app.UseCors(CORSPolicyName);

app.UseSwagger();
app.UseSwaggerUI();

app.UseStatusCodePages();

ProductHandlers.MapRoutes(app.MapGroup("/product")).WithTags("product Operations");

if (!builder.Environment.IsEnvironment(ConfigConsts.UnitTestingEnvironmentName))
{
    app.Logger.LogInformation("Configuring health checks...");
    /*
    Map readiness check endpoint.

    Could be to make sure service is available to handle requests, e.g. when using `wait-on` NPM package or in Docker Compose service dependencies
    */
    app.MapHealthChecks(ConfigConsts.ReadinessEndpoint);
    app.Logger.LogInformation("Configured readiness health check");

    /*
    Map LIVENESS check endpoint

    Could be used by an orchestrator to restart an instance/container
    */
    app.MapHealthChecks(ConfigConsts.LivenessEndpoint, new HealthCheckOptions()
    {
        Predicate = healthCheck => healthCheck.Tags.Contains(ApplicationLifecycleHealthCheckName),
    });
    app.Logger.LogInformation("Configured liveness health check");
}

app.Logger.LogInformation("About to call app.Run()");
app.Run();
app.Logger.LogInformation("app.Run() called successfully. App is now running...");


public partial class Program { }
