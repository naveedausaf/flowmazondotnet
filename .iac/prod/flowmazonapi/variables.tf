variable "resource_group_name" {
  description = "The name of the Azure resource group."
  type        = string
  default     = "rg-flowmazon-api-prod"
}

variable "resource_group_location" {
  description = "The name of the Azure resource group."
  type        = string
  default     = "East US 2"
}

# MUST BE SUPPLIED externally when the configuration is run
variable "allowed_cors_origins_for_api" {
  description = "the string that would be set as value of config key ALLOWED_CORS_ORIGINS for the API"
  type        = string

}

variable "supporting_resource_group_name" {
  description = "The name of the Azure resource group that contains supporting resources such as key vault, ACR etc. this would already have been created by a different module/workspace."
  type        = string
  default     = "rg-flowmazon-supporting-prod"
}

variable "app-name" {
  description = "Name of the ACA app that would run flowmazonapi"
  type        = string
  default     = "aca-app-flowmazonapi-prod"
}

variable "app-container-port" {
  description = "port at which the app container listens"
  type        = number
  default     = 8080
}

variable "app-environment-name" {
  description = "Name of the ACA environment that would be created and would contain the ACA app"
  type        = string
  default     = "aca-env-flowmazonapi-prod"
}

variable "acr_name" {
  description = "The name of the Azure Ccontainer Registry instance."
  type        = string
  default     = "acrflowmazonprod"
}

variable "version_to_deploy" {
  description = "SemVer version to deploy, starting with 'v'. this would be the tag of the image for flowmazonapi in the container registry e.g. `v1.0.1`"
  type        = string
}

variable "flowmazon_api_managed_identity" {
  description = "Name of the user-assigned managed identity that would be assigned to the ACA app"
  type        = string
  default     = "flowmazon_api_managed_identity"
}

variable "app_key_vault_name" {
  description = "The name of the key vault."
  type        = string
  default     = "keyvaultflowmazonprod"
}

variable "app_domain_name" {
  description = "The custom domain name for the app, e.g. api.efast.uk"
  type        = string
}

variable "app_container_name" {
  description = "Name of the container that would be created in the ACA app"
  type        = string
}

locals {
  #repository name of the image in ACR (excluding the
  # '<registry name>.azurecr.io/' prefix and the ':<tag>' suffix)
  image_repository_name                         = "flowmazondotnet-flowmazonbackend"
  allowed_cors_origins_env_var_name             = "ALLOWED_CORS_ORIGINS"
  connection_string_env_var_name                = "ConnectionStrings__FlowmazonDB"
  key_vault_secretname_connectionstring_for_api = "flowmazon-db-connection-string-for-api"

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

# Cloudflare
variable "cloudflare_api_token" {
  description = "CloudFlare's API Token This is required by the CloudFlare provider.Create a account API token (preferred to User API token) with following permissions: 1. 'Zone | DNS | Edit` (to create and modify TXT and CNAME records) and 2. 'Zone | Zone Settings | Edit' (to set 'tls_client_auth' setting to 'on' which ensures that CloudFlare would present a certificate to target of CNAME record when communicating with it; this achieves mTLS; n UI this can be done by going to the zone, then going to 'SSL/TLS | Origin Server' menu option on the left). Make sure that the zone of interest on which these permissions apply is also selected under 'Zone Resources' - or 'All zones from the acount' is selected - when you assign these permissions to the token."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name api_domain_name variable."
  type        = string
  sensitive   = true
}


