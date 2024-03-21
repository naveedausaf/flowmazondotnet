using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Threading.Tasks;

using flowmazonapi;
using flowmazonapi.Domain;
using flowmazonapi.Handlers;
using flowmazonapi.Services;
using flowmazonapi.Services.ProductService;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

app.UseForwardedHeaders();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}
app.UseStatusCodePages();



ProductHandlers.MapRoutes(app.MapGroup("/product"));

app.Run();



