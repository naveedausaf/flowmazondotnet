
using System.Net.Http.Json;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using flowmazonapi.TestSupport.Products;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestPlatform.ObjectModel;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.Client;
using Testcontainers.PostgreSql;
using Xunit.Abstractions;
using System.Text;
using DotNet.Testcontainers.Networks;
using flowmazonapi.TestSupport;
using Microsoft.EntityFrameworkCore;

namespace flowmazonapi.IntegrationTests;

public class APITestFixture : IAsyncLifetime
{
    //public readonly TestLogger Logger = new TestLogger();

    private int _apiPort;
    public const int SUTContainerExposedPort = 8080;


    public HttpClient CreateHttpClient()
    {
        return new HttpClient() { BaseAddress = new Uri($"http://{_sutContainer.Hostname}:{_apiPort}/") };
    }

    private PostgreSqlContainer? _postgresContainer;
    public PostgreSqlContainer PostgresContainer
    {
        get
        {
            return _postgresContainer ?? throw new InvalidOperationException();
        }
        set
        {
            _postgresContainer = value;
        }
    }

    private IContainer? _sutContainer;
    private IContainer SUTContainer
    {
        get
        {
            return _sutContainer ?? throw new InvalidOperationException();
        }
        set
        {
            _sutContainer = value;
        }
    }


    private INetwork? _network;
    private INetwork Network
    {
        get
        {
            return _network ?? throw new InvalidOperationException();
        }
        set
        {
            _network = value;
        }
    }

    public async Task InitializeAsync()
    {
        Network = new NetworkBuilder()
            .Build();

        const string databaseCotainerNetworkAlias = "database-container";
        PostgresContainer = new PostgreSqlBuilder()
        .WithNetwork(_network)
        .WithNetworkAliases(databaseCotainerNetworkAlias)
        .Build();

        await PostgresContainer.StartAsync().ConfigureAwait(false);
        await ProductTestData.MigratePgsqlSUTDatabase(PostgresContainer.GetConnectionString());

        var futureImage = new ImageFromDockerfileBuilder()
  .WithDockerfileDirectory(CommonDirectoryPath.GetSolutionDirectory(), string.Empty)
  .WithDockerfile("Dockerfile")
  //.WithLogger(Logger)
  .Build();

        await futureImage.CreateAsync().ConfigureAwait(false);

        //basing this on the format of the connection string
        //returned by PostgreContainer.GetConnectionString()
        //needed to do this because GetConnectionString() returns
        //a conenction string that has loopback IP addres and port
        //is the one that the container's exposed port (the one it 
        //listens on: 5432) is mapped to on the host (local machine).
        //This is fine for accessing the database from local machine
        //(e.g. to run migrations as we have done above) but on the 
        //Docker SDN on which we have put the app and DB containers
        //so ap pcontainer can access the DB container, this wouldn't
        //work. Instead, in this case, the conenctionstring needs to 
        //have the actual port on wihch Postgres listens and which is
        //also exposed on the container, and the network alias
        //that we have assigned to the DB container on the SDN
        //instead of 127.0.0.1.
        var networkConnectionString = $"Host={databaseCotainerNetworkAlias};Port={PostgreSqlBuilder.PostgreSqlPort};Database={PostgreSqlBuilder.DefaultDatabase};Username={PostgreSqlBuilder.DefaultUsername};Password={PostgreSqlBuilder.DefaultPassword}";

        SUTContainer = new ContainerBuilder().WithImage(futureImage)
        .WithEnvironment("ConnectionStrings__FlowmazonDB", networkConnectionString)
        .WithEnvironment("ALLOWED_CORS_ORIGINS", "http://localhost")
        .WithPortBinding(SUTContainerExposedPort, true)
        .WithNetwork(_network)
        .Build();

        await SUTContainer.StartAsync().ConfigureAwait(false);


        _apiPort = SUTContainer.GetMappedPublicPort(SUTContainerExposedPort);


    }
    public async Task DisposeAsync()
    {
        await SUTContainer.DisposeAsync();
        await PostgresContainer.DisposeAsync();
        await Network.DisposeAsync();
    }

}

public class ProductTests : IClassFixture<APITestFixture>, IDisposable
{
    private readonly APITestFixture Fixture;
    private readonly DbVerify DBVerify;

    private HttpClient Client;

    public ProductTests(APITestFixture fixture/* , ITestOutputHelper testOutput */)
    {
        //testOutput.WriteLine(fixture.Logger.AccumulatedLogs.ToString());
        this.Fixture = fixture;

        var testContextOptions = new DbContextOptionsBuilder<TestContext>()
            .UseNpgsql(Fixture.PostgresContainer.GetConnectionString())
            .Options;

        DBVerify = new DbVerify(testContextOptions);

        Client = Fixture.CreateHttpClient();
    }

    public void Dispose()
    {
        this.DBVerify.Dispose();
    }

    [Fact]
    public async Task ValidProductCreated()
    {

        //arrange
        var validProducts = new ValidProducts();
        var testCase = validProducts.TypicalValidProduct;

        //act
        var response = await Client.PostAsJsonAsync(ProductTestData.URIPrefix,
            testCase.NewProduct
        );

        //assert
        int newProductId = await ProductVerify.ProductCreatedSuccessfully(response);
        await DBVerify.ProductInDatabase(newProductId, testCase.NewProduct);

    }

    private class SomeInvalidProducts : TheoryData<InvalidProduct>
    {
        public SomeInvalidProducts()
        {
            var invalidProducts = new InvalidProducts();
            Add(invalidProducts.ProductWithMultipleErrors1);
            Add(invalidProducts.ProductWithMultipleErrors2);
        }

    }

    [Theory]
    [ClassData(typeof(SomeInvalidProducts))]
    public async Task InvalidProductReturnsError(InvalidProduct testCase)
    {
        //arrange

        //act
        var response = await Client.PostAsJsonAsync(ProductTestData.URIPrefix,
            testCase.NewProduct
        );

        //assert
        await ProductVerify.ValidationProblems(response, testCase.ExpectedErrors);
    }
}