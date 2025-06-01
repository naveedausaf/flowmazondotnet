using flowmazonapi.BusinessLogic.ProductService;
using flowmazonapi.Domain;
using flowmazonapi.TestSupport;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using flowmazonapi.UnitTests;
using FluentAssertions;
using System.Data.Common;
using flowmazonapi.BusinessLogic;
using System.Collections.Generic;
using AutoFixture;
using flowmazonapi.TestSupport.Products;

namespace flowmazonapi.UnitTests.BusinessLogic;


public class ProductServiceTests : IAsyncLifetime
{

    private FlowmazonDbContext? _sutContext = null;
    private FlowmazonDbContext SUTContext
    {
        get { return _sutContext ?? throw new InvalidOperationException(); }
        set { _sutContext = value; }
    }

    DbContextOptions<TestContext>? _testContextOptions = null;
    DbContextOptions<TestContext> TestContextOptions
    {
        get
        {
            return _testContextOptions ?? throw new InvalidOperationException();
        }
        set { _testContextOptions = value; }
    }
    private DbConnection? _testConnection = null;
    private DbConnection TestConnection
    {
        get
        {
            return _testConnection ?? throw new InvalidOperationException();
        }
        set
        {
            _testConnection = value;
        }
    }

    private IProductService? _serviceUnderTest;
    private IProductService ServiceUnderTest
    {
        get
        {
            return _serviceUnderTest ?? throw new InvalidOperationException();
        }
        set
        {
            _serviceUnderTest = value;
        }
    }




    [Theory]
    [ClassData(typeof(InvalidProducts))]
    public async void CreateProduct_InvalidProduct(InvalidProduct testCase)
    {
        //ARRANGE


        //ACT
        var actualEx = await Assert.ThrowsAsync<ValidationException>(async () =>

            await ServiceUnderTest.CreateProduct(testCase.NewProduct)
        );

        //ASSERT

        IValidationResult res = actualEx.ValidationResult;
        Assert.False(res.IsValid);

        IDictionary<string, string[]> actualErrors = res.ToDictionary();

        Assert.Equal(testCase.ExpectedErrors.Keys.Order(), actualErrors.Keys.Order());

        foreach (var kv in testCase.ExpectedErrors)
        {
            Assert.Equal(kv.Value.Order(), actualErrors[kv.Key].Order());
        }

        IList<ValidationFailure> expectedValidationFailures =
            TestHelper.DictionaryToSortedListOFValidationFailures(testCase.ExpectedErrors);

        IList<ValidationFailure> actualValidationErrors =
            (from valFailure in res.Errors
             orderby valFailure.PropertyName, valFailure.ErrorMessage
             select valFailure).ToList();


        Assert.Equal(expectedValidationFailures, actualValidationErrors);
    }



    [Theory]
    [ClassData(typeof(ValidProducts))]
    public async Task CreateProduct_ValidProduct(ValidProduct testCase)
    {


        //arrange


        //ACT
        var idOfNewProduct = await ServiceUnderTest.CreateProduct(testCase.NewProduct);

        //ASSERT
        idOfNewProduct.Should().BeGreaterThan(0);
        using var verify = new DbVerify(TestContextOptions);
        await verify.ProductInDatabase(idOfNewProduct, testCase.NewProduct);

    }


    public async Task InitializeAsync()
    {
        TestConnection = new SqliteConnection("Filename=:memory:");
        TestConnection.Open();

        TestContextOptions = new DbContextOptionsBuilder<TestContext>()
            .UseSqlite(TestConnection)
            .Options;

        var sutContextOptions = new DbContextOptionsBuilder<FlowmazonDbContext>()
            .UseSqlite(TestConnection)
            .Options;

        SUTContext = new FlowmazonDbContext(sutContextOptions);
        await SUTContext.Database.MigrateAsync();

        ServiceUnderTest = new ProductService(new ProductValidator(), new CreateProductArgsValidator(), SUTContext);
    }

    public async Task DisposeAsync()
    {
        await SUTContext.DisposeAsync();
        await TestConnection.DisposeAsync();
    }

}
