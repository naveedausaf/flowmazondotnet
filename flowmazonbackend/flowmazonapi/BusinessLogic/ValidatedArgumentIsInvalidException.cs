using System.Diagnostics.CodeAnalysis;

using Microsoft.EntityFrameworkCore.Internal;

namespace flowmazonapi.BusinessLogic;

public class ValidatedArgumentIsInvalidException : ArgumentException
{

    private const string DefaultErrorMessage = "Error in an argument passed to a service method that had already been validated successfully.";

    public ValidatedArgumentIsInvalidException() : base(DefaultErrorMessage)
    {

    }

    public ValidatedArgumentIsInvalidException(string message) : base(message)
    {

    }

    public ValidatedArgumentIsInvalidException(string message, Exception inner) : base(message, inner)
    {

    }

    public required string ArgumentName { get; set; }



}