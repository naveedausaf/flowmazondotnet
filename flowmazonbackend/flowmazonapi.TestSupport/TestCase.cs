using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using flowmazonapi.TestSupport.Products;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace flowmazonapi.TestSupport;

//TODO: REplace this class with a Soruce Generator
//to implement IXunitSerializable on Test Case classes
//and records like ValidProduct and InvalidProduct classes.
//The reason why this couldn't be a base class 
//that implements IXunitSerializable is that
//properties of derived classes (actual test
//case classes) were not getting serialized 
//by System.Json.Text perhaps I would make
//that work instead.
//BUT Source Generatrors would be more efficient also.
public static class XunitSerializationHelper
{

    public static void Deserialize(object obj, IXunitSerializationInfo info)
    {
        object? deserialisedObject = JsonSerializer.Deserialize(
            (string)info.GetValue("WholeObject", typeof(string)), obj.GetType()
        );

        foreach (var prop in GetPublicProps(obj))
        {
            prop.SetValue(obj, prop.GetValue(deserialisedObject));
        }

    }

    public static void Serialize(object obj, IXunitSerializationInfo info)
    {
        info.AddValue("WholeObject", JsonSerializer.Serialize(obj), typeof(string));
    }

    private static IEnumerable<PropertyInfo> GetPublicProps(object obj)
    {
        var type = obj.GetType();

        var publicProps =
        from propInfo in type.GetProperties(BindingFlags.Instance | BindingFlags.Public)
        where propInfo.GetGetMethod(false) != null
        select propInfo;

        return publicProps;
    }
}
