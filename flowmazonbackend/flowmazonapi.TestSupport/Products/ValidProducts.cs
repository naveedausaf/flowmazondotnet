using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using AutoFixture;
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
    public ValidProduct TypicalValidProduct { get; init; }
    public ValidProducts()
    {
        var fixture = new Fixture();

        ValidProduct CreateTestProduct(string name, int price)
        {
            return new ValidProduct
            {
                TestCaseName = name,
                NewProduct = new CreateProductArgs
                {
                    Name = fixture.Create<string>(),
                    Description = fixture.Create<string>(),
                    ImageUrl = $"http://www.{fixture.Create<string>()}.com",
                    Price = price
                }
            };
        }

        Add(CreateTestProduct("Price 0", 0));
        Add(CreateTestProduct("Price max 32-bit int", Int32.MaxValue));

        TypicalValidProduct = CreateTestProduct("Valid product", fixture.Create<int>());
        Add(TypicalValidProduct);

    }

}