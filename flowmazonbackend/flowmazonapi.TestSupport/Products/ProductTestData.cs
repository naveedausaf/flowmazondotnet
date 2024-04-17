
using Microsoft.EntityFrameworkCore;

namespace flowmazonapi.TestSupport.Products;

public class ProductTestData
{
    public const string URIPrefix = "/product";

    public static async Task MigratePgsqlSUTDatabase(string connectionString)
    {
        var sutContextOptions = new DbContextOptionsBuilder<FlowmazonDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        using var sutContext = new FlowmazonDbContext(sutContextOptions);
        await sutContext.Database.MigrateAsync();
    }
}