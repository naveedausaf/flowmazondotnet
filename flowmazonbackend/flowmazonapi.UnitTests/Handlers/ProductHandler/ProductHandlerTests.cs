using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Net;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using flowmazonapi.Domain;
using flowmazonapi.BusinessLogic;
using flowmazonapi.BusinessLogic.ProductService;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Moq;
using Npgsql.Internal;
using NuGet.Frameworks;
using Xunit.Abstractions;
using flowmazonapi.UnitTests;
using Microsoft.Extensions.ObjectPool;
using flowmazonapi.UnitTests.BusinessLogic;
using flowmazonapi.TestSupport;
using flowmazonapi.TestSupport.Products;

namespace flowmazonapi.UnitTests.Handlers.ProductHandler;


public class ProductHandlerTests(TestApplicationFactory appFactory) : IClassFixture<TestApplicationFactory>
{
    private FakerOfCreateProductArgs ProductArgsFaker { get; } = new FakerOfCreateProductArgs();

    //This is the Problem Details response
    //from CreateProduct in case of validation
    //errors (this is what we are testing against):
    //
    // {
    //     "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
    //     "title": "One or more validation errors occurred.",
    //     "status": 400,
    //     "errors": {
    //         "Price": [
    //         "'Price' must be greater than or equal to '0'."
    //         ]
    //     }
    // }

    public static TheoryData<string, Dictionary<string, string[]>> MockValidationErrors => new TheoryData<string, Dictionary<string, string[]>> {
            {
                "one validation error",
                new Dictionary<string, string[]> {
                    {"Name", new string[]{"mock error returned for name" }}
                }
            },
            {
                "one validation error in each of multiple properties",
                new Dictionary<string, string[]> {
                    {"Name", new string[] {"mock error for name"}},
                    {"ImageUrl", new string[] {"mock error for ImageUrl"}}
                }
            },
            {
                "multiple properties with error with multiple validation errors in same property",
                new Dictionary<string, string[]> {
                    {"Name", new string[] {
                        "first mock error in name",
                        "second mock error in name"
                    }},
                    {
                        "ImageUrl", new string[] {
                            "there is a mock error in ImageUrl"
                        }
                    }
                }
            }
    };

    [Theory]
    [MemberData(nameof(MockValidationErrors))]
    public async Task CreateProduct_InvalidProduct_OneValidationError(string testName, Dictionary<string, string[]> expectedErrors)
    {
        //ARRANGE
        var createProductArgs = ProductArgsFaker.Generate();

        var errorList =
            TestHelper.DictionaryToSortedListOFValidationFailures(expectedErrors);

        var valResult = Mock.Of<IValidationResult>(vr => vr.IsValid == false && vr.Errors == errorList && vr.ToDictionary() == expectedErrors);

        var validationEx = new ValidationException
        {
            ValidationResult = valResult

        };

        var mockProductService = new Mock<IProductService>();
        mockProductService.Setup(m => m.CreateProduct(It.IsAny<CreateProductArgs>())).Throws(validationEx);

        using HttpClient client = TestData.CreateClientWithProductService(appFactory, mockProductService.Object);



        //ACT
        var result = await client.PostAsJsonAsync(ProductTestData.URIPrefix, createProductArgs);

        //ASSERT
        await ProductVerify.ValidationProblems(result, expectedErrors);

    }

    [Fact]
    public async Task CreateProduct_InvalidDataForDataTypes()
    {
        //ARRANGE
        var createProductArgs = new
        {
            Name = "valid name",
            Description = "valid description",
            ImageUrl = "http://www.google.com",
            Price = "just a string, this is invalid from price"
        };

        var productService = TestData.CreateStubProductServiceThatReturnsFakeID();
        var client = TestData.CreateClientWithProductService(appFactory, productService);

        //ACT
        var response = await client.PostAsJsonAsync(ProductTestData.URIPrefix, createProductArgs);

        //ASSERT
        ProductVerify.Generic_BadRequest_ProblemDetailsResponse(response);

    }

    [Theory]
    [ClassData(typeof(ValidProducts))]
    public async Task CreateProduct_ValidProduct(ValidProduct testCase)
    {
        //ARRANGE        
        var productService = TestData.CreateStubProductServiceThatReturnsFakeID();

        using var client = appFactory.WithWebHostBuilder(
            builder => builder.ConfigureTestServices(services =>
            {
                services.AddScoped<IProductService>(s => productService);
            })
        ).CreateClient();


        //ACT
        var result = await client.PostAsJsonAsync(ProductTestData.URIPrefix, testCase.NewProduct);

        //ASSERT
        int productId = await ProductVerify.ProductCreatedSuccessfully(result);
        Assert.Equal(TestData.FakeId_NotAPossibleValueFromDB, productId);

    }




}

