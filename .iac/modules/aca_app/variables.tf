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

variable "app_container_max_replicas" {
  description = "Mazimum number of replicas that the container should scale to."
  type        = number
  default     = 1 # safe, and economical for toy apps
}



# TODO: Refactor the following three
# module args into a single argument
variable "image_login_server" {
  description = "login_Server part of the name of the container image that is to be run e.g. in 'mcr.microsoft.com/apnet:8.0' the login_Server is 'mcr.microsoft.com'."
  type        = string
}

variable "image_repository" {
  description = "Name of the Docker image to deploy (excluding the '<login_server>/' prefix and the ':<tag>' suffix)"
  type        = string
}

variable "image_tag" {
  description = "tag of the image whose name is provided in `image_repository`"
  type        = string
}

variable "app_revision_mode" {
  description = "revision mode of the container app"
  type        = string

  # # better practice for revision mode to be "Multiple"
  # # but "Single" is a simpler default
  # default = "Single"
}

variable "managed_identity_id" {
  description = "id of the user-assigned managed identity that would be assigned to the ACA app. This would be used to pull image from Azure Container Regitry and read secret value from Azure Key Vault"
  type        = string
}

variable "key_vault_id" {
  description = "id of the key vault from which secrets required by the app will be read."
  type        = string
}

# Variables for configuration specific to application logic
############################################################

# TODO: Make passing of secrets and non-secret
# config keys and values to the deployed app generic
# This would make the module reusable and publishable.
variable "vault_secretname_for_connectionstring" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

variable "vault_secretid_for_connectionstring" {
  description = "id of the secret whose value is the connection string to be used by the API to connect to the database. This is required because we are using a user-assigned managed identity to access the secret."
  type        = string
}

variable "allowed_cors_origins_for_api" {
  description = "the string that would be set as value of config key ALLOWED_CORS_ORIGINS for the API"
  type        = string

}

locals {
  allowed_cors_origins_env_var_name = "ALLOWED_CORS_ORIGINS"
  connection_string_env_var_name    = "ConnectionStrings__FlowmazonDB"

}


# Cloudflare variables
############################################################
# To generate this token, create an Account API token by going
# to your user profile in your CloudFalre account, then clicking
# **API Token** in the nav on the left hand side.
#
# Note an Account API token is preferred to a User API token.
#
# Give the token the following permissions: 
# 1. 'Zone | DNS | Edit` (to create and modify TXT and CNAME records)
# 2. 'Zone | Zone WAF | Edit` (to set rate limiting rule)
# to 'on' which ensures that CloudFlare would present a certificate
# to target of CNAME record when communicating with it; this 
# achieves mTLS.
# 
# Make sure that the zone of interest on which these permissions apply
# is also selected under 'Zone Resources' - or 'All zones from the acount' 
# is selected - when you assign permissions to the token.
#
variable "cloudflare_api_token" {
  description = "CloudFlare's API Token."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name specified in api_domain_name variable. It is assumed that Cloudflare is managing the apex domain and therefore has a zone for it, whose Zone ID needs to be provided in this variable. If Cloudflare is does not manage the apex domain, then in order to use this module, you would need to transfer it to Cloudflare which would involve registering the nameservers that Cloudflare would show you when you transfer the apex domain to it, and registering these with your domain registrar."
  type        = string
  sensitive   = true
}

variable "rate_limit_requests_per_period" {
  description = "number of request that, if received in the configured `period` (fixed to 10 seconds in free plan), would lead to the sending IP being blocked for the configured `mitigation_timeout` (also fixed to 10 seconds in free plan)"
  type        = number
}

variable "cloudflare_rate_limiting_rule_name" {
  description = "Name of the rate limiting rule. This has several nuances, including why it is creaed at the Zone level rather than hostname level and why it defaults to value \"default\". See README for details."
  type        = string
  default     = "default"

}
##########

# variable "blue-version-number" {
#     description = "SemVer version number of the last deployment to the Blue environment"
#     type = string

# }

# variable "green-version-number" {
#     description = "SemVer version number of the last deployment to the Green environment"
#     type = string

# }

# variable "production-env" {
#     description = "Label - either `blue` or `green` - of the environment that is currently live"
#     type = string
#     default = "blue"
# }
