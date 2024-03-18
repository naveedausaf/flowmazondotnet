using flowmazonapi.Domain;

using FluentValidation;

namespace flowmazonapi.Services;

public class ProductService
{

    private readonly IValidator<Product> _productValidator;
    private readonly FlowmazonDbContext _dbContext;

    public ProductService(IValidator<Product> productValidator, FlowmazonDbContext dbContext)
    {
        this._productValidator = productValidator;
        this._dbContext = dbContext;

    }

    public async Task<Result<int>> CreateProduct(CreateProductArgs args)
    {
        var product = new Product
        {
            Name = args.Name,
            Description = args.Description,
            ImageUrl = args.ImageUrl,
            Price = args.Price
        };

        var validationResult = new FluentValidationValidationResult(_productValidator.Validate(product));
        if (!validationResult.IsValid)
        {
            return new Result<int>(-1, validationResult);
        }
        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();
        return new Result<int>(product.Id, validationResult);


    }

    public class CreateProductArgs
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public int Price { get; set; }
    }
}
