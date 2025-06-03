using System.ComponentModel.DataAnnotations;

using FluentValidation;

namespace flowmazonapi.BusinessLogic.ProductService;

/// <summary>
/// Details of the product to be created
/// </summary>
public record CreateProductArgs
{

    /// <summary>
    /// Name of the product
    /// </summary>
    //[Required]
    public string? Name { get; set; }


    /// <summary>
    /// A description for the product
    /// </summary>
    //[Required]
    public string? Description { get; set; }


    /// <summary>
    /// URL of an image of the product
    /// </summary>
    //[Required]
    public string? ImageUrl { get; set; }


    /// <summary>
    /// Price of the product. Must be greater than or equal to zero.
    /// </summary>
    //[Required]
    public decimal? Price { get; set; }
}

public class CreateProductArgsValidator : AbstractValidator<CreateProductArgs>
{
    public CreateProductArgsValidator()
    {
        RuleFor(args => args.Name).NotEmpty();
        RuleFor(args => args.Description).NotEmpty();
        RuleFor(args => args.ImageUrl).NotEmpty();
        RuleFor(args => args.Price).NotNull();
    }


}