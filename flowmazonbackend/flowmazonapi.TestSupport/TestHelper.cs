using System.Reflection;
using flowmazonapi.BusinessLogic;

namespace flowmazonapi.TestSupport;

public static class TestHelper
{


    public static IList<ValidationFailure> DictionaryToSortedListOFValidationFailures(Dictionary<string, string[]> errorDictionary)
    {
        return (from kv in errorDictionary
                orderby kv.Key
                from err in kv.Value
                orderby err
                select new ValidationFailure { PropertyName = kv.Key, ErrorMessage = err }

             ).ToList();
    }

}

