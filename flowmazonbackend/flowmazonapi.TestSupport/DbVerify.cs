using flowmazonapi.BusinessLogic.ProductService;
using Microsoft.EntityFrameworkCore;
using Xunit;


namespace flowmazonapi.TestSupport;


public class DbVerify : IDisposable
{
    private bool disposed;

    private TestContext Context { get; init; }

    public DbVerify(DbContextOptions<TestContext> contextOptions)
    {


        Context = new TestContext(contextOptions);
    }

    //TODO: Separate out interface (actual typed interfaces,
    //DTOs like CraeteProductArgs from flowmazonapi into
    //flowmazonapi.BusinessLogic.Interfaces). This would
    //make explicit our observance of Dependency Inversion
    //Principle. It would also help ensure certain test code,
    //projects such as this TestSupport library and Integration
    //Test library, do not depend on the implemenatation/
    //business logic project at all which just helps
    //to keep edges clean an separated.
    public async Task ProductInDatabase(int id, CreateProductArgs expectedProps)
    {
        var product = await Context.Products.FindAsync(id);
        Assert.NotNull(product);
        Assert.Equal(expectedProps.Name, product.Name);
        Assert.Equal(expectedProps.Description, product.Description);
        Assert.Equal(expectedProps.ImageUrl, product.ImageUrl);
        Assert.Equal(expectedProps.Price, product.Price);

    }


    public void Dispose()
    {
        if (!disposed)
        {

            Context.Dispose();

            disposed = true;
        }
    }
}

public class ProductForTest
{
    //everything is nullable in this 
    //representation of a product for
    //testing puposes. If something that
    //shoudln't be null is actually null, 
    //it would get flagged during a test
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }

    public decimal? Price { get; set; }


}
public class TestContext : DbContext
{
    public TestContext(DbContextOptions<TestContext> options) : base(options)
    {

    }


    public DbSet<ProductForTest> Products { get; set; }

}