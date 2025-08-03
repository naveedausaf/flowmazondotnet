

# vars for db_branch module
variable "managed_identity_name" {
  description = "Name of the user-assigned managed identity to which read permissions would be assigned to the key vault secret that this module would create."
  type        = string
}



variable "vault_name" {
  description = "The name of the key vault into which the key vault secrets crated by this module would be stored."
  type        = string
}

variable "id_and_vault_resource_group_name" {
  description = "Name of the Azure resource group in which the vault and user-assinged managed identity exists."
  type        = string
}

variable "vault_secretname_for_connectionstring" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

variable "secretname_for_psql_owner_connectionstring" {
  description = "Name of the GitHub Environment secret in which to store psql connection String that includes credentials of db owner account that would be used to connect to and execute queries (including DDL) on the database from psql."
  type        = string
}

variable "environmentname_for_secrets_and_variables" {
  description = "Name of GitHub repo Environment in which to store secrets and variables such as psql_owner_connection_string."
  type        = string
}

variable "repository_for_secrets_and_variables" {
  description = "Name of GitHub repo in an an Environment of which (specified by `environmentname_for_secrets_and_variables` argument) secrets and variables such as psql_owner_connection_string would be stored. This should just be the repo's name, and NOT prefixed by account name or organisation name and NOT a fully qualified repo name either. Otherwise the repo may not be found. For example I would provide `flowmazondotnet` as the repo name instead of `EnableHub/flowmazondotnet` or `https://github.com/EnableHub/flowmazondotnet`."
  type        = string
}

variable "neon_project_id" {
  description = "project_id of the Neon DB Project in which a new branch would be created by this module. This is also the project that contains the source branch off of which the new branch will be created."
  type        = string
}

variable "neon_source_branch_id" {
  description = "branch_id of the specified Neon DB Project branch from which a new branch would be created by this module."
  type        = string
}

variable "neon_new_branch_name" {
  description = "Name of the new branch that would be created in the specified Neon DB Project. Credentials for this branch would be stored (in key vault as app connection string andin GitHub Environment as owner connection string for use from psql to run migrations etc.)"
  type        = string
}

variable "neon_database_name" {
  description = "The name of the database in the specified Neon DB project. Permissions would be assigned in this database to the app role which this module would create on the new branch. Also, connection strings for connecting to this database, from app and owner role respectively which this module would create, would be stored as secrets."
  type        = string
}

variable "neon_app_role" {
  description = "The name for the Neon role that the application will use."
  type        = string
  sensitive   = true
}

variable "neon_owner_role" {
  description = "The name for the Neon owner role which would be used to connect to the specified database over psql (e.g. to run migrations)."
  type        = string
  sensitive   = true
}



# additional vars for flowmazonfrontend module
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
  description = "Name of the secret in which to store project_id of the created vercel_project. The vercel project id isused by GitHub Actions workflows."
  type        = string
}
