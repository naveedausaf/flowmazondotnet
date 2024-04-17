
using flowmazonapi.BusinessLogic;

namespace flowmazonapi.BusinessLogic;

public class FluentValidationValidationResult : IValidationResult
{
    readonly FluentValidation.Results.ValidationResult _validationResult;
    public FluentValidationValidationResult(FluentValidation.Results.ValidationResult validationResult)
    {
        this._validationResult = validationResult;
        this.Errors = validationResult.Errors.Select(f => new ValidationFailure { PropertyName = f.PropertyName, ErrorMessage = f.ErrorMessage }).ToList<ValidationFailure>();

    }

    public IList<ValidationFailure> Errors { get; set; }

    public bool IsValid
    {
        get { return this.Errors.Count == 0; }
    }

    public IDictionary<string, string[]> ToDictionary()
    {
        return _validationResult.ToDictionary();
    }

}

