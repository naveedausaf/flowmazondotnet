using System.ComponentModel;

using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace flowmazonapi.Domain
{
    public class Product
    {
        /// <summary>
        /// if of the product
        /// </summary>
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }

        public required int Price { get; set; }


    }
}

