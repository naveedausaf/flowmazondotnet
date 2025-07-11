
# vars for container registry module
variable "container_registry_resource_group_name" {
  description = "Name of the resource group that would be created. The Azure Container Registry instance created by this module would be placed in this resource group."
  type        = string
}

variable "container_registry_resource_group_location" {
  description = "Location of the resource group that would be created."
  type        = string
}

variable "container_registry_name" {
  description = "Name of the Azure Container Registry instance that would be created."
  type        = string
}

# variables for id_vault module

variable "key_vault_name" {
  description = "The name of the key vault that would be created."
  type        = string
}

variable "managed_identity_name" {
  description = "The name of the user-assigned managed identity that would be created."
  type        = string
}

variable "id_and_vault_resource_group_name" {
  description = "The name of the resource group that would be created. The user-assigned managed identity and the key vault creaetd by this module would be placed in this resource group."
  type        = string
}

variable "id_and_vault_resource_group_location" {
  description = "The location of the resource group that would be created."
  type        = string
}

# variables for db module
variable "vault_secretname_for_connectionstring" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

# Neon DB variables for db module

# This can be found on Settings page in the Neon DB UI
variable "neon_org_id" {
  description = "Organization ID of the Neon Organization in which the new project would be created."
  type        = string
  sensitive   = true
}


variable "neon_project_name" {
  description = "The name for the Neon project that would be created."
  type        = string
}

variable "neon_branch_name" {
  description = "The name for the default Neon branch for the project (e.g., 'main' or 'prod')."
  type        = string
}

variable "neon_database_name" {
  description = "The name of the database to be created in Neon (e.g., 'flowmazondb')."
  type        = string
}

# for the following role names,
# bear in mind that in NeonDB roles and users
# are synonymous
variable "neon_app_role" {
  description = "The name for the Neon database role that the application will use."
  type        = string
  sensitive   = true
}

variable "neon_owner_role" {
  description = "The name for the Neon database owner role."
  type        = string
  sensitive   = true
}


# vars for aca_app module

variable "app_resource_group_name" {
  description = "The name of the Azure resource group in which the app would be created."
  type        = string
}

variable "app_resource_group_location" {
  description = "Location of the Azure resource group n which the app would be created."
  type        = string
}

variable "app_name" {
  description = "Name of the ACA app that would be created."
  type        = string
}

variable "app_environment_name" {
  description = "Name of the ACA environment that would be created and would contain the ACA app"
  type        = string
}

variable "app_domain_name" {
  description = "The custom domain name for the app, e.g. api.efast.uk"
  type        = string
}

variable "app_container_name" {
  description = "Name of the Docker container that would be created in the ACA app"
  type        = string
}

variable "app_container_port" {
  description = "port at which the app container listens"
  type        = number
}

variable "app_container_liveness_probe" {
  description = "The pathname (starting with `/`) of the Liveness probe for the container (e.g. an endpoint `/health/live` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
  nullable    = true
}

variable "app_container_readiness_probe" {
  description = "The pathname (starting with `/`) of the Readiness probe for the container (e.g. an endpoint `/health/ready` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
  nullable    = true
}

variable "app_container_startup_probe" {
  description = "The pathname (starting with `/`) of the Startup probe for the container (e.g. an endpoint `/health/startup` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
  nullable    = true
}

variable "image_repository" {
  description = "Name of the Docker image to deploy (excluding the '<registry name>.azurecr.io/' prefix and the ':<tag>' suffix)"
  type        = string
}

variable "image_tag" {
  description = "tag of the image whose name is provided in `image_repository`"
  type        = string
}

variable "allowed_cors_origins_for_api" {
  description = "the string that would be set as value of config key ALLOWED_CORS_ORIGINS for the API"
  type        = string

}

variable "cloudflare_api_token" {
  description = "CloudFlare's API Token."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name specified in api_domain_name variable."
  type        = string
  sensitive   = true
}

variable "rate_limit_requests_per_period" {
  description = "number of request that, if received in the configured `period` (fixed to 10 seconds in free plan), would lead to the sending IP being blocked for the configured `mitigation_timeout` (also fixed to 10 seconds in free plan)"
  type        = number
}

# vars for flowmazonfrontend module
variable "vercel_team_id" {
  description = "Team ID displayed on you Setting page of a Team in your Vercel account. We need this to create a project, and the project would be created in in the team with the given Team ID."
  type        = string
  sensitive   = true
}

variable "vercel_project_name" {
  description = "Name of the project that would be created."
  type        = string

}

variable "vercel_app_domain_name" {
  description = "Desired domain name for the Vercel project. This will be mapped to the project's own domain name in vercel through a CNAME record with external DNS provider like Cloudflare."
  type        = string
}


