using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;

public class TestApplicationFactory
    : WebApplicationFactory<Program>
{
    protected override IHost CreateHost(IHostBuilder builder)
    {
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