using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.OpenApi.Models;

using Swashbuckle.AspNetCore.SwaggerGen;

namespace flowmazonapi;

public class HttpValidationProblemFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {

        if (context.Type == typeof(HttpValidationProblemDetails))
        {
            schema.Description = @"This is the schema for the JSON response body that will be used to communciate an error using [IETF Problem Details specification](https://datatracker.ietf.org/doc/html/rfc7807).

            If the type UR is ??? then the error occurred during validation of a field of the provided request JSON body, of a parameter or while validating a business rule that involves multiple fields/and/or parameters.  In this case the `errors` field of the returned JSON response body would contain a list of validation errors.

            If the `type` URI is ??? then the error is due to any of the following:
            
            * request body is malformed 
            * a value provided for a field was malformed or of an incorrect data type.

            If the cause of the error is 
        


";
        }
    }
}

public class HttpProblemFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {

    }
}
