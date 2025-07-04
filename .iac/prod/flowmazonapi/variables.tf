variable "app_resource_group_name" {
  description = "The name of the Azure resource group in which the app would be created."
  type        = string
}

variable "app_resource_group_location" {
  description = "Location of the Azure resource group n which the app would be created."
  type        = string
}

variable "allowed_cors_origins_for_api" {
  description = "the string that would be set as value of config key ALLOWED_CORS_ORIGINS for the API"
  type        = string

}

variable "core_resource_group_name" {
  description = "The name of the Azure resource group that contains supporting resources such as key vault, ACR etc. this would already have been created by a different module/workspace."
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

variable "flowmazon_api_managed_identity" {
  description = "Name of the user-assigned managed identity that would be assigned to the ACA app"
  type        = string
}

variable "app_key_vault_name" {
  description = "The name of the key vault from which secrets required by the app will be read."
  type        = string
}

variable "key_vault_secretname_connectionstring_for_api" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}


variable "app_domain_name" {
  description = "The custom domain name for the app, e.g. api.efast.uk"
  type        = string
}

variable "app_container_name" {
  description = "Name of the container that would be created in the ACA app"
  type        = string
}

variable "app_container_port" {
  description = "port at which the app container listens"
  type        = number
  # default     = 80
}

variable "acr_name" {
  description = "The name of the Azure Ccontainer Registry instance which contains the image to be deployed to the ACA app."
  type        = string
}

variable "image_repository_name" {
  description = "Name of the Docker image to deploy (excluding the '<registry name>.azurecr.io/' prefix and the ':<tag>' suffix)"
  type        = string
}

variable "version_to_deploy" {
  description = "SemVer version to deploy, starting with 'v'. this would be the tag of the image for flowmazonapi in the container registry e.g. `v1.0.1`"
  type        = string
}

variable "app_revision_mode" {
  description = "revision mode of the container app"
  type        = string

  # # better practice for revision mode to be "Multiple"
  # # but "Single" is a simpler default
  # default = "Single"
}


locals {
  allowed_cors_origins_env_var_name = "ALLOWED_CORS_ORIGINS"
  connection_string_env_var_name    = "ConnectionStrings__FlowmazonDB"

}

# Cloudflare variables

# To generate this token, create an Account API token by going
# to your user profile in your CloudFalre account, then clicking
# **API Token** in the nav on the left hand side.
#
# Note an Account API token is preferred to a User API token.
#
# Give the token the following permissions: 
# 1. 'Zone | DNS | Edit` (to create and modify TXT and CNAME records)
# 2. 'Zone | Zone Settings | Edit' (to set 'tls_client_auth' setting
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

# I assume you already have a DNS A record with CloudFlare for
# the apex domain in the domain name of the app. For example
# if the domain name if `api.efast.uk`, the apex domain is
# efast.uk
#
# Creating this A record would have given you a Zone for the
# apex domain.
#
# Once you have created an A record, go to CloudFlare Dashboard.
# There click the apex domain name, and you would be taken to
# the detail page of the associated zone. ZoneID would be 
# displayed on this page (you may have to scroll down the page).
variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name specified in api_domain_name variable."
  type        = string
  sensitive   = true
}

variable "rate_limit_requests_per_period" {
  description = "number of request that, if received in the configured `period` (fixed to 10 seconds in free plan), would lead to the sending IP being blocked for the configured `mitigation_timeout` (also fixed to 10 seconds in free plan)"
  type        = number
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
