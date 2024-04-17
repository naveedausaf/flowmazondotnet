using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace flowmazonapi.TestSupport.Products;

public static class ProductVerify
{
    public static async Task<int> ProductCreatedSuccessfully(HttpResponseMessage result)
    {
        Assert.Equal(HttpStatusCode.Created, result.StatusCode);
        string responseContent = await result.Content.ReadAsStringAsync();
        Assert.Equal("", responseContent);
        Assert.True(result.Headers.Contains("Location"), "Response does not contain header named Location");
        var location = result.Headers.GetValues("Location").Single();
        Assert.True(!string.IsNullOrEmpty(location), "Location should be a non-empty string");
        int productId;
        Assert.True(int.TryParse(location.Substring(ProductTestData.URIPrefix.Length + 1), out productId),
        $"New product's URI not in the correct format. Expected it to be of form ${ProductTestData.URIPrefix}/{{new product id}}");
        return productId;

    }

    //This is the URI that identifies
    //a Bad Reqeust. Since Validation Errors
    //are returned with this URI when 
    //TypedResults.ValidationProblem method
    //is called, therefore instead of modifying
    //the URI when calling
    //TypedResults.ValidationProblem throughout
    //the code we just adopt it as the URI 
    //specifically for Valiadation Problems.
    //If other 400-Bad Request problems occur, 
    //e.g. attempt to delete a prorduct that 
    //has already been deleted, we would 
    //come up with specific URI's to identify
    //those problems in line with IETF
    //Problem Details specification (even though
    //the status code for that would also be 
    //400 - Bad Request)
    //
    //NOTE THAT you would also get this URI
    //if there was an error in model binding
    //before the request even reached your handler
    //For example if Null is provided for 
    //an int field of the JSON request body-bound 
    //parameter, then the request wouldn't get to 
    //the handler and an error, with this URI,
    //would be returned.
    //THIS IS OK as if the request is malformed 
    //so that it 
    const string GenericProblemDetailsTypeURIForBadRequest = "https://tools.ietf.org/html/rfc9110#section-15.5.1";

    //        private record GenericProblemDetails(string? type, string? title, HttpStatusCode? status);

    public static async void Generic_BadRequest_ProblemDetailsResponse(HttpResponseMessage result)
    {

        const HttpStatusCode expectedStatusCode = HttpStatusCode.BadRequest;
        Assert.Equal(expectedStatusCode, result.StatusCode);
        var body = await result.Content.ReadFromJsonAsync<ValidationErrors>();
        Assert.NotNull(body);
        Assert.Equal(expectedStatusCode, body.status);
        Assert.Equal(GenericProblemDetailsTypeURIForBadRequest, body.type);

        //Commented out the line below because in Development environment
        //this is the full namespace-qualified name of BadRequestException
        //as produced by the DeveloperExceptionPagesMiddleware (which produces
        //a Problem Details response because we have an IProblemDetailsService
        //added to builder.Services)
        //
        //Assert.Equal("Bad Request", body.title);

        //make sure this is a generic problem details response, 
        //not that is produced in case of a validation exception rasied 
        //explicitly in application code:
        Assert.Null(body.errors);
    }
    private record ValidationErrors(string? type, string? title, HttpStatusCode? status, Dictionary<string, string[]> errors);
    // 
    public static async Task ValidationProblems(HttpResponseMessage result, Dictionary<string, string[]> expectedErrors)
    {
        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        var body = await result.Content.ReadFromJsonAsync<ValidationErrors>();
        Assert.NotNull(body);



        Assert.Equal(GenericProblemDetailsTypeURIForBadRequest, body.type);
        Assert.Equal(HttpStatusCode.BadRequest, body.status);
        Assert.NotNull(body.title);
        Assert.NotEqual("", body.title);
        Assert.NotNull(body.errors);
        Assert.Equal(expectedErrors.Keys.OrderBy(key => key), body.errors.Keys.OrderBy(key => key));
        foreach (var propErrors in body.errors.ToList())
        {
            Assert.Equal(expectedErrors[propErrors.Key], propErrors.Value);
        }

    }
}