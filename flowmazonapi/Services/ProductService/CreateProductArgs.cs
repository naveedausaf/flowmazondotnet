using FluentValidation;

namespace flowmazonapi.Services.ProductService;

//In the commented out code cnippet below:
//
//1. I had required keyword before the three string 
// properties. That failed the HTTP request at
// model binding stage if any of these was not
// supplied in the request. 
//
// 2. int property was never required and was
// to zero. I got the same behaviour when I removed 
// requried from teh three string proeprties, i.e.
// they got defaulted to empty string when not supplied.
// THIS DEFAULTING BY MODEL BINDER IS PROLEMATIC. For 
//example, we might wabnt to specify a price of 0
//e.g. if something is free. But this cannot be 
//assumed if the Price is altogether mising 
//from the request.
//
//3. So the behaviour when i had the requried attribute 
//on fields that are mandatory was correct and I should 
//have placed it on Price also.
//The problems with having it however were that
//(this is mostly hypothesis, need to verify):
//a. We didn't get a proper ProblemDetails response.
//In particular, we couldn't set type and title
//properly, or to the same strings that they 
//get set to when we call TypedResults.ValidationProblem
//b. Error would be thrown on the first field
//that wasn't supplied and not all required fields
//that were missing were pointed out.
//c. Individual error messages would not be the same
//as when nullity errors would be identified
//during validation in code using FluentValidation
//(however this is a moot point as if the nullity errors
//arise at model binding stage, our own validation
//for this would never execute. And if nullity errors
//did not arise at model binding, then again our
//own validation for thsi wouldn't execute; so our
//code for required validation would never execute if
//reqruied-ness is already expressed in code using
//required attribute)
//TODO: Verify all assumptions a to c above
//
//4. Conversely, everything that is NOT REQUIRED should
//be markes as nullable. So use nullable reference types 
//(NRTs) for strings and other reference types like
//string, and Nulalble<T> for value types/structs like int
//TODO: Investoaget what would happed if a proeprty
//of a class tyupe is not marked as nullable (strings
//are defaulted to empty strings in this situation by
//the model binder but what would it deafult a field 
//of a class type such as an Address class?)


/*public class CreateProductArgs
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public int Price { get; set; }
    }*/

public class CreateProductArgs
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }

    public int? Price { get; set; }
}

public class CreateProductArgsValidator : AbstractValidator<CreateProductArgs>
{
    public CreateProductArgsValidator()
    {
        RuleFor(args => args.Name).NotEmpty();
        RuleFor(args => args.Description).NotEmpty();
        RuleFor(args => args.ImageUrl).NotEmpty();
        RuleFor(args => args.Price).NotNull();
        RuleFor(args => args.Price).GreaterThanOrEqualTo(0);
    }


}