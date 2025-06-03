using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Bogus;
using flowmazonapi.BusinessLogic.ProductService;
using Microsoft.VisualBasic;
using Xunit;
using Xunit.Abstractions;

namespace flowmazonapi.TestSupport.Products;

public class ValidProduct : IXunitSerializable
{

    public required string TestCaseName { get; set; }

    public required CreateProductArgs NewProduct { get; set; }

    public void Deserialize(IXunitSerializationInfo info)
    {
        XunitSerializationHelper.Deserialize(this, info);
    }

    public void Serialize(IXunitSerializationInfo info)
    {
        XunitSerializationHelper.Serialize(this, info);
    }

}

public class ValidProducts : TheoryData<ValidProduct>
{
    FakerOfCreateProductArgs ProductArgsFaker = new FakerOfCreateProductArgs();
    Faker DataGenerator = new()
    {
        Random = new Randomizer(1) // Use a fixed seed for determinism
    };
    public ValidProduct TypicalValidProduct { get; init; }
    public ValidProducts()
    {


        ValidProduct CreateTestProduct(string testCaseName, decimal? price = null)
        {
            var result = new ValidProduct
            {
                TestCaseName = testCaseName,
                NewProduct = ProductArgsFaker.Generate()
            };
            if (price != null)
            {
                result.NewProduct.Price = price;
            }
            return result;

        }

        Add(CreateTestProduct("Price 0", 0));
        Add(CreateTestProduct("Price is maximum possible", 50000));
        Add(CreateTestProduct("Price two decimal digits", 29.99m));
        Add(CreateTestProduct("Price one decimal digits", 29.9m));
        Add(CreateTestProduct("Price zero decimal digits", 29m));

        TypicalValidProduct = CreateTestProduct("Valid product");
        Add(TypicalValidProduct);

    }

}