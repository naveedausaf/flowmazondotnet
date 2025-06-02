## Running the app in Debug mode

Use VS Code compund launch configuartion **Frontend/Backend** to run in debug mode. Just select from launch configurations dropdown it in Debug sidebar window (Ctrl), then whenever yo upress F5, the configuration will launch.

Bear in mind that to stop debugging with this compound configuration, yuo will need to press Shift+F5 twice and not once.

## Configuration

For details of configuration key/value pairs that need to be provided to each service, and how to provide these - e.g. using config files in local development but environment variables at build and/or run of deployment or containers - see the READMEs of respective services ([frontend app](./flowmazonfrontend/README.md) and [backend api](./flowmazonbackend/flowmazonapi/README.md)).

You can also check out any Docker compose files (see [compose.yaml](./compose.yaml) for local continuous testing using Playwright tests) and TestContainers-based code (in [API Integration Tests](./flowmazonbackend/flowmazonapi.IntegrationTests/)) for some examples of how config values are provided to the services.
