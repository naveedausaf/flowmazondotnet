using System.ComponentModel;

using flowmazonapi.Domain;
using flowmazonapi.Services;
using flowmazonapi.Services.ProductService;

using Microsoft.AspNetCore.Http.HttpResults;

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
                h.Parameters[0].Description = "Id of the product which is to be fethed frmo the database.";
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
    /// <param name="p">This is the Product to be vreated</param>
    /// <param name="productService"></param>
    /// <param name="linkGen"></param>
    /// <param name="httpContext"></param>
    /// <returns></returns>
    private static async Task<Results<Created, ValidationProblem>> HandleCreateProduct(CreateProductArgs p, ProductService productService, LinkGenerator linkGen, HttpContext httpContext)
    {

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

            //I don't see any need for specifying
            //type and title for validation errors,
            //regardless of the service or method 
            //that they pertain to. Hence the code
            //below has been commented out.
            //
            //ALSO, there are three http status codes 
            //tath are candaidates for reporting validation
            //errors: 400 (Bad Request), 422 (indicates 
            //that the server understands the content type 
            //of the request entity, and the syntax of the 
            //request entity is correct, but it was unable 
            //to process the contained instructions)
            //and 402 (Not Found, could be returned 
            //from a GET handler to say that an item with
            //requested id coul not be found in the system)
            //
            //ARGUABLY, 400 is more generic so we could
            //use it for all validation errors, even though
            //422 might be more suitable for validation
            //errors in the model and 400 for validation
            //errors in parameters (i.e. in arguments
            //object). HOWEVER< I DON'T YET SEE THE VALUE
            //IN DISTINGUISHING BETWEEN THE TWO.

            /* ,
                title: "Product is not valid", type: "http://flowmazon.example.com/product/invalidproduct"); */
        }



        //TODO: Perhaps the biggest thing I need to try is to 
        //put back requried-nedd checking in parameter objects.
        //This means checking of data types (which will always 
        //happen) and checking of requiredness will happen in
        //model binder. WE SHALL ASSUME THIS IS THE ONLY CHECKING
        //NEEDED FOR PARAMETER OBJECTS.
        //
        //I NEED TO ENSURE THAT the response returned in 
        //PRODUCTION, by any middleware (e.g. StatusCodePages
        //or by the EndpointMiddleware; it won't be 
        //ExceptionHandlerMiddleware as role of that in production 
        //in a minimal API app is only to create a generic 
        //Problem Details response for 500 - Internal Server Error)
        //is an appropriate Problem Details response. Generic type
        //and status 400 would be ok for this purpose.
        //
        //THEN WE AUTOMATICALLY HAVE CHECKING FOR THESE TWO 
        //THINGS ABOUT A PARAMETERS OBJECT IN SERVICE METHODS
        //ALSO BECAUSE A PARAEMTERS OBJECT CAN'T COME INTO A
        //METHOD CALL - WHETHER FROM A NAPI OR ANY OTHER CALLER -
        //UNLESS REQUIRED VALUES ARE THERE AND DATA TYPES 
        //ARE CORRECT.
        //
        //In the service then, we can raise problems (I am 
        //choosing to do these via a custom exception at the moment)
        //WITH SPECIFIC TYPE (as Problem Details RFC recommends)
        //and AN APPROPRIATE SATUS CODE (choice is probabaly
        //only between 400 and 422 and for problems raised
        //by service would likely be 422). Also, we do not
        //get any duplication that would likely result from 
        //validating the pamameters object
        //separately from the Domain object for which we definitely
        //need to have validation

        //TODO In connection with above note, 
        //consider creating an endpoint filter for catching 
        //our ValidationException and returning 
        //TypedResults.ValidationProblem from it.
        //THIS would eliminate all try..catch clauses like
        //the one above.
    }

    //TODO: Figure out what the convention for 
    //names of endpoints is AND if we should set
    //group name (using .WithGroupName extension 
    //method probably applied to the route group 
    //created in Program.cs rather than to the 
    //routes being mapped in this file).
    //THIS INFO will probabaly come from a 
    //revision of the OpenAPI chapter.
    //DO WE EVEN NEED NAMES specified by
    //.WithName(...)? Are they taken into
    //account by OpenAPI?
    //I ask this becausein sample code
    //for EF chapter, he has only applied
    //WithName() on the Get handler that
    //had to be passed to LinkGenerator
    //in the POST handler

}