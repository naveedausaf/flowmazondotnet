
using flowmazonapi.BusinessLogic.ProductService;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Moq;

namespace flowmazonapi.UnitTests.Handlers.ProductHandler;

public static class TestData
{
    public const int FakeId_NotAPossibleValueFromDB = -1;

    public static IProductService CreateStubProductServiceThatReturnsFakeID()
    {
        var mockProductService = new Mock<IProductService>();
        mockProductService.Setup(m => m.CreateProduct(It.IsAny<CreateProductArgs>())).ReturnsAsync(TestData.FakeId_NotAPossibleValueFromDB);
        return mockProductService.Object;
    }


    public static HttpClient CreateClientWithProductService(WebApplicationFactory<Program> appFactory, IProductService productService)
    {
        return appFactory.WithWebHostBuilder(
                    builder => builder.ConfigureTestServices(services =>
                    {
                        services.AddScoped<IProductService>(s => productService);
                    })
                ).CreateClient();
    }

}