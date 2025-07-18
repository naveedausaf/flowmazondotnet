# vars for aca_app module
#
# We already have info for the following input variables 
# for this module:
#
# acr_name
# acr_resource_group_name
# app_revison_mode - this would always be "Multiple" for Blue-Green
# managed_identity_name
# managed_identity_resource_group_name
# vault_name
# vault_resource_group_name
# vault_secretname_connectionstring_for_api
#
# And for the following we are relying on defaults, so not
# inputting or supplying a value:
#
# app_container_max_replicas
# cloudflare_rate_limiting_rule_name


variable "app_resource_group_name" {
  description = "The name of the Azure resource group in which the app would be created."
  type        = string
  default     = "rg-flowmazon-api-prod"
}

variable "app_resource_group_location" {
  description = "Location of the Azure resource group n which the app would be created."
  type        = string
  default     = "East US 2"
}

variable "app_name" {
  description = "Name of the ACA app that would be created."
  type        = string
  default     = "aca-app-flowmazonapi-prod"
}

variable "app_environment_name" {
  description = "Name of the ACA environment that would be created and would contain the ACA app"
  type        = string
  default     = "aca-env-flowmazonapi-prod"
}

variable "app_domain_name" {
  description = "The custom domain name for the app, e.g. api.efast.uk"
  type        = string
  default     = "api.efast.uk"
}

variable "app_container_name" {
  description = "Name of the Docker container that would be created in the ACA app"
  type        = string
  default     = "flowmazonapi"
}

variable "app_container_port" {
  description = "port at which the app container listens"
  type        = number
  default     = 8080
}

variable "app_container_liveness_probe" {
  description = "The pathname (starting with `/`) of the Liveness probe for the container (e.g. an endpoint `/health/live` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
  nullable    = true
  default     = "/health/live"
}

variable "app_container_readiness_probe" {
  description = "The pathname (starting with `/`) of the Readiness probe for the container (e.g. an endpoint `/health/ready` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
  nullable    = true
  default     = "/health/ready"
}

variable "app_container_startup_probe" {
  description = "The pathname (starting with `/`) of the Startup probe for the container (e.g. an endpoint `/health/startup` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
  nullable    = true
  default     = "/health/live"
}

variable "image_repository" {
  description = "Name of the Docker image to deploy (excluding the '<registry name>.azurecr.io/' prefix and the ':<tag>' suffix)"
  type        = string
  default     = "flowmazondotnet-flowmazonbackend"
}

variable "image_tag" {
  description = "tag of the image whose name is provided in `image_repository`"
  type        = string
  default     = "v1.0.1"
}

variable "allowed_cors_origins_for_api" {
  description = "the string that would be set as value of config key ALLOWED_CORS_ORIGINS for the API"
  type        = string
  default     = "www.efast.uk"

}

# cloudflare and restful PROVIDERS
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
  default     = 20
}
