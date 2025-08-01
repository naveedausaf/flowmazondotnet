This Terraform module does the following:

- Creates a Vercel project for Next.js with the specified name, the serverside logic in which - SSR and api routes - execute in the specified region.
- Assigns a `*.vercel.app` domain name to the project with a randomly generated subdomain.
- Create an unproxied CNAME record for the project with the specified domain name which points to the project's Vercel domain name.
- Stores the project_id of the created Vercel project in a GitHub Environment secret in the specified repo and environment and with the specified secret name.

## Region for Server-Side Logic Execution

- Vercel Functions - [into which SSR and api routes in the Next.js app are translated](https://nextjs.org/learn/pages-router/deploying-nextjs-app-platform-details) by Vercel - run in a [single region by default](https://vercel.com/docs/functions#functions-lifecycle) and not on edge servers. (even if it were possible to run Vercel Functions on edge nodes, it is [not recommended for performance and reliability](https://vercel.com/docs/functions/runtimes/edge)).

  This module configures Vercel Functions (including SSR and api routes) in the app to run in a single specified region.

- It is possible to configure Vercel Functions to run in multiple regions but his requires an expensive paid Vercel plan and, to work effectively, would also require your data to be geo-replicated.

  This module does not configure the project to run Vercel Functions in multiple regions.

- The value provided for `env_OTEL_EXPORTER_OTLP_ENDPOINT` parameter should be an OTLP endpoint exposed by the observability backend or other Otel collector that is as physically close to the Vercel project's region as possible. This is because this endpoint is used by the server-side logic of the app - api routes or SSR - which runs in the region of the Vercel project and not on edge servers.

  It may be most efficient to provide the endpoint of Vercel's own Otel collector. However Vercel's Otel collector is only available on the paid plan and can only forward to a small selection of observability backends.

  If using Grafana Cloud, it should be the endpoint for the GRafana Cloud region that is closest to the region of the Vercel project. For exampple if we provided value of `cle1` for the `vercel_region_for_server_side_execution` parameter of this module, then the Grafana Cloud endpoint - which has the general form `https://otlp-gateway-prod-{region identifier}.grafana.net/otlp` - should be `https://otlp-gateway-prod-us-east-2.grafana.net/otlp`. This was obtained by filling in the region code, `us-east-2`, from **Cloud Provider Region** column in [this list](https://grafana.com/docs/grafana-cloud/security-and-account-management/regional-availability/)and considering the fact that Vercel is hosted on AWS in the same region.
