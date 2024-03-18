
using flowmazonapi.Services;

namespace flowmazonapi.Services;

public class FluentValidationValidationResult : IValidationResult
{
    readonly FluentValidation.Results.ValidationResult _validationResult;
    public FluentValidationValidationResult(FluentValidation.Results.ValidationResult validationResult)
    {
        this._validationResult = validationResult;
        this.Errors = (IList<IValidationFailure>)validationResult.Errors.Select(f => new FluentValidationFailure { PropertyName = f.PropertyName, ErrroMessage = f.ErrorMessage }).ToList();

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
    public string PropertyName { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    public string ErrroMessage { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
}