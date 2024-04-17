using System.Reflection;
using AutoFixture;
using flowmazonapi.BusinessLogic;

namespace flowmazonapi.TestSupport;

public static class TestHelper
{
    public static string CreateURL(Fixture fixture)
    {
        return $"http://www.{fixture.Create<string>()}.com";
    }

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

