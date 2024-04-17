using System.Security.Principal;

using flowmazonapi.Domain;

using FluentValidation;
using FluentValidation.Results;

namespace flowmazonapi.BusinessLogic.ProductService;

public class ProductService : IProductService
{

    private readonly IValidator<Product> _productValidator;
    private readonly IValidator<CreateProductArgs> _createProductArgsValidator;

    private readonly FlowmazonDbContext _dbContext;

    public ProductService(IValidator<Product> productValidator, IValidator<CreateProductArgs> createProductArgsValidator, FlowmazonDbContext dbContext)
    {
        this._productValidator = productValidator;
        this._createProductArgsValidator = createProductArgsValidator;
        this._dbContext = dbContext;

    }

    public async Task<int> CreateProduct(CreateProductArgs args)
    {
        var validationEx = (FluentValidation.Results.ValidationResult validationResult) => new ValidationException { ValidationResult = new FluentValidationValidationResult(validationResult) };

        var argsValidationResult = _createProductArgsValidator.Validate(args);
        if (!argsValidationResult.IsValid)
        {
            throw validationEx(argsValidationResult);
        }

        var argEx = (string arg) => new ValidatedArgumentIsInvalidException { ArgumentName = arg };

        var product = new Product
        {

            Name = args.Name ?? throw new ValidatedArgumentIsInvalidException
            {
                ArgumentName = nameof(args.Name)
            },
            Description = args.Description ?? throw argEx(nameof(args.Description)),
            ImageUrl = args.ImageUrl ?? throw argEx(nameof(args.ImageUrl)),
            Price = args.Price ?? throw argEx(nameof(args.Price))
        };

        var validationResult = _productValidator.Validate(product);

        if (!validationResult.IsValid)
        {
            throw validationEx(validationResult);
        }

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();
        return product.Id;


    }

}
