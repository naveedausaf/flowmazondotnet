namespace flowmazonapi.BusinessLogic.ProductService;

public interface IProductService
{
    Task<int> CreateProduct(CreateProductArgs args);

}