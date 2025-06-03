using Bogus;
using flowmazonapi.BusinessLogic.ProductService;
using flowmazonapi.Domain;
using flowmazonapi.TestSupport.Products;

public class FakerOfCreateProductArgs : Faker<CreateProductArgs>
{

    /// <summary>
    /// Not providing a seedless constructor as it is
    /// bad for determinism.
    /// </summary>
    /// <param name="seed">Defaults to 1</param>
    /// <remarks>
    /// <para
    /// Make sure that you create a new
    /// instance of faker whenever you want to generate
    /// instances in a sequence (whether one at a time
    /// using `Generate()` or a number of them at a
    /// time using `Generate(n)`), e.g. a new 
    /// instance per test method or per method or class
    /// that  generates and returns test data objects.
    /// </para>
    /// <para>
    /// Also, always add a a new field's rule in this
    /// constructor at the end. This ensures that
    /// other generated values are always 
    /// (determinstically) the same in every run.
    /// </para>
    /// <para>
    /// Also, avoid chaning existing rules.
    /// </para>
    /// <para>
    /// Finally, be careful about changing test
    /// code that uses a Faker. If you are somehow
    /// changing the number of objects you generate
    /// in an iteration (e.. by having nested loops)
    /// then the sequence of generated objects may
    /// not tally with what you had before.
    /// </para>
    /// </remarks>
    public FakerOfCreateProductArgs(int seed = 1)
    {
        UseSeed(seed);
        RuleFor(p => p.Name, f => f.Commerce.ProductName());
        RuleFor(p => p.Description, f => f.Lorem.Paragraph());
        RuleFor(p => p.ImageUrl, f => f.Image.PicsumUrl());
        RuleFor(p => p.Price, f => f.Finance.Amount(0, 5000));

    }


}