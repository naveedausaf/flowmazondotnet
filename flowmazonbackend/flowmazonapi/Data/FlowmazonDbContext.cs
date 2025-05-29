

using flowmazonapi.Domain;

using Microsoft.EntityFrameworkCore;

namespace flowmazonapi;

public class FlowmazonDbContext : DbContext
{
    public FlowmazonDbContext(DbContextOptions<FlowmazonDbContext> options) : base(options)
    {

    }

    public DbSet<Product> Products { get; set; }


}
