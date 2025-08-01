variable "vercel_team_id" {
  description = "Team ID displayed on you Setting page of a Team in your Vercel account. We need this to create a project, and the project would be created in in the team with the given Team ID."
  type        = string
  sensitive   = true
}

variable "vercel_project_name" {
  description = "Name of the project that would be created."
  type        = string
  sensitive   = true
}

variable "vercel_app_domain_name" {
  description = "Desired domain name for the Vercel project. This will be mapped to the project's own domain name in vercel through a CNAME record with external DNS provider like Cloudflare."
  type        = string
}

variable "vercel_region_for_server_side_execution" {
  description = "Region in which server-side logic in the Next.js app will execute. Vercel Functions - into which SSR and api routes are translated - run in a single region by default not on edge servers. Pick a 'Region Code' from this list: https://vercel.com/docs/edge-network/regions#region-list"
  type        = string
}

variable "cloudflare_api_token" {
  description = "CloudFlare's API Token with permissions to `Zone | DNS Zone | DNS | Edit` permission on the Zone for the apex domain whose subdomain is going to be mapped to Vercel project's domain name via a CNAME record."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name specified in api_domain_name variable."
  type        = string
  sensitive   = true
}

variable "env_NEXT_PUBLIC_OTEL_ENVIRONMENT" {
  description = "Name of the Otel environment. This would be reported as value of semantic convention 'deployment.environment.name' to the observability backend. This variable would be set as an environment variable on the created Vercel app."
  type        = string
}

variable "env_OTEL_EXPORTER_OTLP_ENDPOINT" {
  description = "OTLP endpoint of the observability backend. This variable would be set as an environment variable on the created Vercel app and would be used by the server-side logic (SSR, api routes etc.) to write telemetry. To reduce latency and improve performance, the provided endpoint should be located as close to region of the Vercel project - specified as value of 'vercel_region_for_server_side_execution' parameter of this module - as possible."
  type        = string
}

variable "env_OTEL_EXPORTER_OTLP_PROTOCOL" {
  description = "The transport, e.g. grpc or http/protobuf, that would be used to write telemetry to the OTLP endpoint. This variable would be set as an environment variable on the created Vercel app."
  type        = string
}

variable "env_OTEL_EXPORTER_OTLP_HEADERS" {
  description = "Authorization header that would be provided when writing telemetry to the observability backend using OpenTelemetry protocol. Grafana Cloud would show this if you press Details button on your Stack, then generate a new token; base-64 encoded value of this token would be included in the generated Authorization header that would be shown. This variable would be set as an environment variable on the created Vercel app and marked as SENSITIVE."
  type        = string
  sensitive   = true
}

variable "secretname_for_vercel_project_id" {
  description = "Name of the secret in which to store project_id of the created vercel_project."
  type        = string
}

variable "environmentname_for_vercel_project_id" {
  description = "Name of GitHub repo Environment in which to store project_id of the created vercel_project. In this environment the project_id would be stored as a secret with name specified by `secretname_for_vercel_project_id` argument."
  type        = string
}

variable "repository_for_vercel_project_id" {
  description = "Name of GitHub repo in an an Environment of which (specified by `environmentname_for_vercel_project_id` argument) the project_id of the created vercel project would be stored. This should just be the repo's name, and NOT prefixed by account name or organisation name and NOT a fully qualified repo name either. Otherwise the repo may not be found. For example I would provide `flowmazondotnet` as the repo name instead of `EnableHub/flowmazondotnet` or `https://github.com/EnableHub/flowmazondotnet`."
  type        = string
}
