using AutoFixture;
using flowmazonapi.BusinessLogic.ProductService;
using Xunit;
using Xunit.Abstractions;


namespace flowmazonapi.TestSupport.Products;

public class InvalidProduct : IXunitSerializable
{
    public required string TestCaseName { get; set; }
    public required CreateProductArgs NewProduct { get; set; }
    public required Dictionary<string, string[]> ExpectedErrors { get; set; }

    public void Deserialize(IXunitSerializationInfo info)
    {
        XunitSerializationHelper.Deserialize(this, info);
    }

    public void Serialize(IXunitSerializationInfo info)
    {
        XunitSerializationHelper.Serialize(this, info);
    }
}


public class InvalidProducts : TheoryData<InvalidProduct>
{
    public InvalidProduct ProductWithMultipleErrors1 { get; }
    public InvalidProduct ProductWithMultipleErrors2 { get; }

    public InvalidProducts()
    {

        var fixture = new Fixture();

        Add(
           new InvalidProduct
           {
               TestCaseName = "Price is negative",
               NewProduct = new CreateProductArgs
               {

                   Name = fixture.Create<string>(),
                   Description = fixture.Create<string>(),
                   ImageUrl = TestHelper.CreateURL(fixture),
                   Price = -1
               },

               ExpectedErrors = new Dictionary<string, string[]> { {
                "Price", new[] { "'Price' must be greater than or equal to '0'." }
                }
            }
           });

        Add(
            new InvalidProduct
            {

                TestCaseName = "Price is null",
                NewProduct = new CreateProductArgs
                {
                    Name = fixture.Create<string>(),
                    Description = fixture.Create<string>(),
                    ImageUrl = TestHelper.CreateURL(fixture),
                    Price = null
                },
                ExpectedErrors = new Dictionary<string, string[]> { {
                "Price", new[] { "'Price' must not be empty." }
                }
            }
            });

        Add(new InvalidProduct
        {
            TestCaseName = "Name is null",
            NewProduct = new CreateProductArgs
            {
                Name = null,
                Description = fixture.Create<string>(),
                ImageUrl = TestHelper.CreateURL(fixture),
                Price = fixture.Create<int>()
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"Name", new []{"'Name' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "Name is empty",
            NewProduct = new CreateProductArgs
            {
                Name = "",
                Description = fixture.Create<string>(),
                ImageUrl = TestHelper.CreateURL(fixture),
                Price = fixture.Create<int>()
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"Name", new []{"'Name' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "Description is null",
            NewProduct = new CreateProductArgs
            {
                Name = fixture.Create<string>(),
                Description = null,
                ImageUrl = TestHelper.CreateURL(fixture),
                Price = fixture.Create<int>()
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"Description", new []{"'Description' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "Description is empty",
            NewProduct = new CreateProductArgs
            {
                Name = fixture.Create<string>(),
                Description = "",
                ImageUrl = TestHelper.CreateURL(fixture),
                Price = fixture.Create<int>()
            },
            ExpectedErrors =
new Dictionary<string, string[]> {
                {"Description", new []{"'Description' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "ImageUrl is null",
            NewProduct = new CreateProductArgs
            {
                Name = fixture.Create<string>(),
                Description = fixture.Create<string>(),
                ImageUrl = null,
                Price = fixture.Create<int>()
            },
            ExpectedErrors =
            new Dictionary<string, string[]> {
                {"ImageUrl", new []{"'Image Url' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "ImageUrl is empty",
            NewProduct = new CreateProductArgs
            {
                Name = fixture.Create<string>(),
                Description = fixture.Create<string>(),
                ImageUrl = "",
                Price = fixture.Create<int>()
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"ImageUrl", new []{"'Image Url' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "ImageUrl not valid URL",
            NewProduct = new CreateProductArgs
            {
                Name = fixture.Create<string>(),
                Description = fixture.Create<string>(),
                ImageUrl = fixture.Create<string>()/*this is just a 
            string, not a valid URL*/,
                Price = fixture.Create<int>(),
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"ImageUrl", new []{"'Image Url' must be a well-formed URL."}
                }
            }
        });

        ProductWithMultipleErrors1 = new InvalidProduct
        {
            TestCaseName = "Multiple errors - ImageURL not well formed and Name missing - but only one caught when validating CreateProductArgs",
            NewProduct = new CreateProductArgs
            {
                Name = null,
                Description = fixture.Create<string>(),
                ImageUrl = fixture.Create<string>()/*this is just a 
            string, not a valid URL*/,
                Price = fixture.Create<int>()
            },
            ExpectedErrors = new Dictionary<string, string[]> {
            {
                "Name", new[] { "'Name' must not be empty." }
            }
            }
        };

        Add(ProductWithMultipleErrors1);

        ProductWithMultipleErrors2 = new InvalidProduct
        {
            TestCaseName = "Multiple errors - Name and Price both missing - all caught when validating CreateProductArgs",
            NewProduct = new CreateProductArgs
            {
                Name = null,
                Description = fixture.Create<string>(),
                ImageUrl = TestHelper.CreateURL(fixture),
                Price = null
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {
                "Price", new[] { "'Price' must not be empty." }
                },
                {
                    "Name", new[] { "'Name' must not be empty." }
                }
            }
        };
        Add(ProductWithMultipleErrors2);
    }

}
