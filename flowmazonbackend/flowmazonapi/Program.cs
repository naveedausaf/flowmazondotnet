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

const string CorsPolicy_AllowFlowmazonWeb = "AllowFlowmazonWeb";

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();

}

builder.Services.AddProblemDetails();


var connString = builder.Configuration.GetConnectionString("FlowmazonDB");
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

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(CorsPolicy_AllowFlowmazonWeb, policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
    });

}

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}

app.UseRouting();

if (app.Environment.IsDevelopment())
{
    app.UseCors(CorsPolicy_AllowFlowmazonWeb);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseStatusCodePages();

ProductHandlers.MapRoutes(app.MapGroup("/product")).WithTags("product Operations");

app.Run();


public partial class Program { }
