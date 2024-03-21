
using flowmazonapi.Services;

namespace flowmazonapi.Services;

public class FluentValidationValidationResult : IValidationResult
{
    readonly FluentValidation.Results.ValidationResult _validationResult;
    public FluentValidationValidationResult(FluentValidation.Results.ValidationResult validationResult)
    {
        this._validationResult = validationResult;
        this.Errors = validationResult.Errors.Select(f => new FluentValidationFailure { PropertyName = f.PropertyName, ErrroMessage = f.ErrorMessage }).ToList<IValidationFailure>();

    }

    public IList<IValidationFailure> Errors { get; set; }

    public bool IsValid
    {
        get { return this.Errors.Count == 0; }
    }

    public IDictionary<string, string[]> ToDictionary()
    {
        return _validationResult.ToDictionary();
    }

}

public class FluentValidationFailure : IValidationFailure
{
    public required string PropertyName { get; set; }
    public required string ErrroMessage { get; set; }
}