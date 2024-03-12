using System;
using System.Globalization;

using FluentValidation;
using FluentValidation.Validators;

using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace flowmazonapi.Domain;

public static class ValidationHelpers
{
    public static bool BeAValidURL(string strUrl)
    {

        Uri? uri;
        return Uri.TryCreate(strUrl, UriKind.Absolute, out uri);
    }

}
