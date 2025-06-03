using System.ComponentModel.DataAnnotations.Schema;
using Bogus;
using flowmazonapi.BusinessLogic.ProductService;
using flowmazonapi.Domain;
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
    FakerOfCreateProductArgs ProductArgsFaker = new FakerOfCreateProductArgs();
    Faker DataGenerator = new()
    {
        Random = new Randomizer(1) // Use a fixed seed for determinism
    };


    public InvalidProduct ProductWithMultipleErrors1 { get; }
    public InvalidProduct ProductWithMultipleErrors2 { get; }

    public InvalidProducts()
    {



        Add(
           new InvalidProduct
           {
               TestCaseName = "Price is negative",
               NewProduct = ProductArgsFaker.Generate() with
               {
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
                NewProduct = ProductArgsFaker.Generate() with
                {
                    Price = null
                },
                ExpectedErrors = new Dictionary<string, string[]> { {
                "Price", new[] { "'Price' must not be empty." }
                }
            }
            });

        Add(
            new InvalidProduct
            {

                TestCaseName = "Price above max allowed",
                NewProduct = ProductArgsFaker.Generate() with
                {
                    Price = 50001
                },
                ExpectedErrors = new Dictionary<string, string[]> { {
                "Price", new[] { "'Price' must be less than or equal to '50000'." }
                }
            }
            });

        Add(
            new InvalidProduct
            {

                TestCaseName = "Price more than two decimal places",
                NewProduct = ProductArgsFaker.Generate() with
                {
                    Price = 123.456m
                },
                ExpectedErrors = new Dictionary<string, string[]> { {
                "Price", new[] { "'Price' can only have up to 2 decimal places." }
                }
            }
            });

        Add(new InvalidProduct
        {
            TestCaseName = "Name is null",
            NewProduct = ProductArgsFaker.Generate() with
            {
                Name = null
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"Name", new []{"'Name' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "Name is empty",
            NewProduct = ProductArgsFaker.Generate() with
            {
                Name = ""
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"Name", new []{"'Name' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "Description is null",
            NewProduct = ProductArgsFaker.Generate() with
            {
                Description = null
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"Description", new []{"'Description' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "Description is empty",
            NewProduct = ProductArgsFaker.Generate() with
            {
                Description = ""
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
            NewProduct = ProductArgsFaker.Generate() with
            {
                ImageUrl = null
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
            NewProduct = ProductArgsFaker.Generate() with
            {
                ImageUrl = ""
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"ImageUrl", new []{"'Image Url' must not be empty."}
                }
            }
        });

        Add(new InvalidProduct
        {
            TestCaseName = "ImageUrl not valid URL",
            NewProduct = ProductArgsFaker.Generate() with
            {
                ImageUrl = "not-a-url" + DataGenerator.Random.Int(1, 1000).ToString()
            },
            ExpectedErrors = new Dictionary<string, string[]> {
                {"ImageUrl", new []{"'Image Url' must be a well-formed URL."}
                }
            }
        });

        ProductWithMultipleErrors1 = new InvalidProduct
        {
            TestCaseName = "Multiple errors - ImageURL not well formed and Name missing - but only one caught when validating CreateProductArgs",
            NewProduct = ProductArgsFaker.Generate() with
            {
                Name = null,
                ImageUrl = "not-a-url" + DataGenerator.Random.Int(1, 1000).ToString()
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
            NewProduct = ProductArgsFaker.Generate() with
            {
                Name = null,
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
