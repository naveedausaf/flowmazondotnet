## Configuration

Config settings (key-value pairs) may be provided to a running instance of this service as environment variables: this is the highest priority source of config settings and this is how config is normally provided to instances of this app deployed to the cloud or running as Docker containers locally.

Config may also be provided by other, lower priority sources such as `appSettings.json` or .NET User Secrets (in which I store connection strings and other secrets for local development).

### Required Configuration

The following confguration settings are required:

1. `ConnectionStrings__FlowmazonDB`
   This is the connection string to the database that app (for which this image is built) uses.

2. `ALLOWED_CORS_ORIGINS`
   This is a semicolon-separated list of allowed CORS origins that the app would accept connections from when request is made from a browser.

   Example: `http://localhost:4000`

   **This does need to be set to a valid value,** even if the app is not supposed take requests from a browser. **Therefore in API integration tests, I set it to a dummy value ( e.g. `http://localhost`)**.

### Optional Configuration

The ASP.NET Core accepts several configuration settings which aer all optional.

One of these is `ASPNETCORE_ENVIRONMENT` which defaults to `Development` but in a Docker image for this app, the base ASP.NET Core image for the app image sets it to `Production`.
