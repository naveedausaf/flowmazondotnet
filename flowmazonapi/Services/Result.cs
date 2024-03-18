

using FluentValidation.Results;

namespace flowmazonapi.Services;


public struct Result<T>
{

    public Result(T val, IValidationResult validationResult)
    {
        this.Value = val;
        this.ValidationResult = validationResult;
    }

    public T Value { get; set; }
    public IValidationResult ValidationResult { get; set; }


}

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