using FluentValidation;

namespace flowmazonapi.Domain;

public class ProductValidator : AbstractValidator<Product>
{
    public ProductValidator()
    {
        RuleFor(product => product.Name).NotEmpty();
        RuleFor(product => product.Description).NotEmpty();
        RuleFor(product => product.ImageUrl).NotEmpty().Must(ValidationHelpers.BeAValidURL).WithName("Image URL");
        RuleFor(product => product.Price).GreaterThanOrEqualTo(0);

    }
}

