using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Threading.Tasks;

using flowmazonapi;
using flowmazonapi.Domain;
using flowmazonapi.Services;

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
builder.Services.AddScoped(typeof(ProductService));

var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}
app.UseStatusCodePages();

var handler = async Task<Results<Created, ValidationProblem>> (ProductService.CreateProductArgs p, ProductService productService) =>
{

    var result = await productService.CreateProduct(p);
    if (result.ValidationResult.IsValid)
    {
        return TypedResults.Created($"/product/{result.Value}");
    }

    //we need to report problem back to client
    //using IETF Problem Details specification
    return TypedResults.ValidationProblem(result.ValidationResult.ToDictionary(),
        title: "Product is not valid", type: "http://flowmazon.example.com/product/invalidproduct");


    //TODO: Check using Hoppscotch that
    //the response from TypesResutls.ValidationProblem()
    //is aligned with the scheme for representing multiple errors
    //in wiki article section "IETF Problem Details Specification"

    //TODO: Set up route group for Product endpoints (pg. 115 of book)

    //TODO: When setting up route group, might want to repalce
    //Created() with CreatedAtRoute() which is passed a route name
    //insead of the exact Uri
};

app.MapPost("/product/", handler);

app.Run();



