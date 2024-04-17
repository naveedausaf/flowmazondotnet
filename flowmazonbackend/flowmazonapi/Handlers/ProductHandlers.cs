using System.ComponentModel;

using flowmazonapi.Domain;
using flowmazonapi.BusinessLogic;
using flowmazonapi.BusinessLogic.ProductService;

using Microsoft.AspNetCore.Http.HttpResults;
using System.Diagnostics;
using Microsoft.OpenApi.Models;

namespace flowmazonapi.Handlers;

public class ProductHandlers
{

    private static class HandlerNames
    {
        public const string GetProduct = "view-product";
        public const string CreateProduct = "create-product";

    }

    public static RouteGroupBuilder MapRoutes(RouteGroupBuilder routeBuilder)
    {
        routeBuilder.MapPost("/", HandleCreateProduct).WithName(HandlerNames.CreateProduct).WithOpenApi();

        routeBuilder.MapGet("/{id}", HandleGetProduct).WithName(HandlerNames.GetProduct).WithOpenApi(
            h =>
            {

                h.Parameters[0].Description = "Id of the product which is to be fetched from the database.";
                return h;
            }

        );


        return routeBuilder;

    }

    /// <summary>
    /// This is the Get Product op.
    /// </summary>
    /// <param name="id">Id of the product to fetch from the system.</param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    private static async Task<Results<Ok<Product>, ValidationProblem>> HandleGetProduct(int id)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Creates a new product
    /// </summary>
    /// <param name="p">This is the Product to be created</param>
    /// <param name="productService"></param>
    /// <param name="linkGen"></param>
    /// <param name="httpContext"></param>
    /// <returns></returns>
    /// <response code="201">
    /// <para><b>201 - Created</b> is returned if 
    /// the Product is created successfully.</para>
    /// <para>
    /// URL to GET the newly created Product would be in
    /// <c>Location</c> response header.
    /// </para>
    /// </response>
    private static async Task<Results<Created, ValidationProblem>> HandleCreateProduct(CreateProductArgs p, IProductService productService, LinkGenerator linkGen, HttpContext httpContext)
    {


        //TODO: Describe all problems using OpenAPI,
        //including the two conditions in which 
        //the generic 400 Problem Details may be received
        //by a client (see wiki for these conditions).
        //Also document the generic 500 response.
        //Then UPDATE THE WIKI (there is a TODO for this
        //in the wiki in 
        //"Reporting Problems using Problem details" section)

        //TODO: Choose different 'type' and 'title'
        //for Validation Problems and create these
        //using a static helper class. Do this once
        //another type of problem that is NOT a validation
        //error needs to be reported fom code.
        //ALL SUCH PROBLEMS need to be documented
        //using OpenAPI


        try
        {
            var result = await productService.CreateProduct(p);


            return TypedResults.Created(linkGen.GetPathByName(HandlerNames.GetProduct, new { id = result }));


        }
        catch (ValidationException ex)
        {
            //we need to report problem back to client
            //using IETF Problem Details specification
            return TypedResults.ValidationProblem(ex.ValidationResult.ToDictionary());


        }

    }

}