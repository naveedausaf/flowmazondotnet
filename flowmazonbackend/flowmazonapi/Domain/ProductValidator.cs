using FluentValidation;

namespace flowmazonapi.Domain;

public class ProductValidator : AbstractValidator<Product>
{
    public ProductValidator()
    {
        RuleFor(product => product.Name).NotEmpty();
        RuleFor(product => product.Description).NotEmpty();
        RuleFor(product => product.ImageUrl).NotEmpty().Must(ValidationHelpers.BeAValidURL).WithMessage("'Image Url' must be a well-formed URL.");
        RuleFor(product => product.Price).GreaterThanOrEqualTo(0).LessThanOrEqualTo(50000).PrecisionScale(7, 2, false).WithMessage("'Price' can only have up to 2 decimal places.");

    }
}

