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



var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();

}

builder.Services.AddProblemDetails();


string connString = builder.Configuration.GetConnectionString("FlowmazonDB") ?? throw new InvalidOperationException("Connection string 'FlowmazonDB' is not configured.");

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
            Description = "API for Flowmazon, the next online shopping destination",
            Version = "v1"
        });

        var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

        options.SchemaFilter<HttpValidationProblemFilter>();

    }
);

const string DevCORSPolicyName = "DevCORSPolicy";
const string ProductionCORSPolicyName = "ProductionCORSPolicy";

//value for this key should be a semicoolon (;) separated list of allowed origins. EAch should NOT end in a forward slash (/).
const string CORSConfigKey = "ALLOWED_CORS_ORIGINS";
if (builder.Environment.IsDevelopment())
{

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(DevCORSPolicyName, policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
    });

}
else
{

    var corsOrigins = builder.Configuration.GetValue<string>(CORSConfigKey);

    if (string.IsNullOrWhiteSpace(corsOrigins))
    {
        //TODO: add test for this
        //TODO: log this as Otel log
        throw new InvalidOperationException("AllowedCORSOrigins configuration value is not set.");
    }

    var origins = corsOrigins.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    if (origins.Length == 0)
    {
        //TODO: add test for this
        //TODO: log this as Otel log
        throw new InvalidOperationException("AllowedCORSOrigins configuration value is empty.");
    }
    //TODO: OTel Log the origins


    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: ProductionCORSPolicyName,
            policy =>
            {



                //TODO: add test for this
                //TODO: log this as Otel log

                policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();


            });
    });
}

const string DatabaseHealthCheckName = "DatabaseHealthCheck";
const string ApplicationLifecycleHealthCheckName = "ApplicationLifecycleHealthCheck";

builder.Services.AddHealthChecks()
    .AddNpgSql(connString, tags: [DatabaseHealthCheckName])

    // From the documentation (https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection.commonhealthchecksextensions.addapplicationlifecyclehealthcheck?view=net-9.0-pp), it is worth adding even if there are not IHostedService or IHostedLifecycleService (that exposes CheckHealthAsync method) registered wth build.Services.
    // This will ensure that the health check endpoint is healthy as long as the application is running, Unhealthy if it is shutting down (And probably also when it is still starting up)
    .AddApplicationLifecycleHealthCheck([ApplicationLifecycleHealthCheckName]);


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}

app.UseRouting();

if (app.Environment.IsDevelopment())
{
    app.UseCors(DevCORSPolicyName);
}
else
{
    app.UseCors(ProductionCORSPolicyName);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseStatusCodePages();

ProductHandlers.MapRoutes(app.MapGroup("/product")).WithTags("product Operations");

/*
Map readiness check endpoint.

Could be to make sure service is available to handle requests, e.g. when using `wait-on` NPM package or in Docker Compose service dependencies
*/
app.MapHealthChecks("/health/ready");

/*
Map LIVENESS check endpoint

Could be used by an orchestrator to restart an instance/container
*/
app.MapHealthChecks("/health/live", new HealthCheckOptions()
{
    Predicate = healthCheck => healthCheck.Tags.Contains(ApplicationLifecycleHealthCheckName),
});

app.Run();


public partial class Program { }
