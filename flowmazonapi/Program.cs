using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Cryptography;

using flowmazonapi;
using flowmazonapi.Domain;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
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

var app = builder.Build();

var handler = (Product p) =>
{
    //first we validate that the product is valid
    var productValidator = new ProductValidator();
    var validationResult = productValidator.Validate(p);

    if (!validationResult.IsValid)
    {
        //we need to report problem back to client
        //using IETF Problem Details specification
        return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            { { "these are the problems", validationResult.Errors.Select(f => f.ErrorMessage).ToArray()} },
            title: "Product is not valid", type: "http://flowmazon.example.com/product/invalidproduct");

    }

    return Results.Ok();

};

app.MapPost("/product/add", handler);

app.Run();



