using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;

/// <summary>
/// Used for unit-testing REST handlers. This requires the request processing pipeline to be set up which is why we need to use WebApplicationFactory.
/// </summary>
public class HandlerTestApplicationFactory
    : WebApplicationFactory<Program>
{

    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.UseEnvironment(ConfigConsts.UnitTestingEnvironmentName);
        builder.ConfigureHostConfiguration(configBuilder =>
        {

            configBuilder.AddInMemoryCollection(
                    new Dictionary<string, string?>(){ { ConfigConsts.CORSConfigKey, "http://localhost" }
                    }.ToList()
                );
        });

        return base.CreateHost(builder);
    }

}