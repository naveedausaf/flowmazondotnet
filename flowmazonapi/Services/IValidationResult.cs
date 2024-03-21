

using FluentValidation.Results;

namespace flowmazonapi.Services;

public interface IValidationResult
{

    bool IsValid { get; }

    IList<IValidationFailure> Errors { get; set; }
    IDictionary<string, string[]> ToDictionary();

}

public interface IValidationFailure
{
    string PropertyName { get; set; }
    string ErrroMessage { get; set; }
}