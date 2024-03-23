using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Threading.Tasks;

using flowmazonapi;
using flowmazonapi.Domain;
using flowmazonapi.Handlers;
using flowmazonapi.Services;
using flowmazonapi.Services.ProductService;

using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

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

builder.Services.AddScoped(typeof(FluentValidation.IValidator<Product>), typeof(ProductValidator));
builder.Services.AddScoped(typeof(FluentValidation.IValidator<CreateProductArgs>), typeof(CreateProductArgsValidator));
builder.Services.AddScoped(typeof(ProductService));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo()
        {
            Title = "Flowmazon API",
            Description = "API for Flowmazon, the next online shopping destination",
            Version = "v1"
        });

        var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    }
);

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}


app.UseSwagger();
app.UseSwaggerUI();

app.UseStatusCodePages();

ProductHandlers.MapRoutes(app.MapGroup("/product")).WithTags("productOperations");

app.Run();



