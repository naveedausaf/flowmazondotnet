

using FluentValidation.Results;

namespace flowmazonapi.BusinessLogic;

public interface IValidationResult
{

    bool IsValid { get; }

    IList<ValidationFailure> Errors { get; set; }
    IDictionary<string, string[]> ToDictionary();

}

public record ValidationFailure
{
    public required string PropertyName { get; set; }
    public required string ErrorMessage { get; set; }
}