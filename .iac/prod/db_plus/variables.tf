# Azure variables

variable "resource_group_name" {
  description = "The name of the Azure resource group."
  type        = string
  default     = "rg-flowmazon-supporting-prod"
}

variable "resource_group_location" {
  description = "The name of the Azure resource group."
  type        = string
  default     = "East US 2"
}

variable "key_vault_name" {
  description = "The name of the key vault."
  type        = string
  default     = "kvflowmazonprod"
}

variable "acr_name" { 
  description = "The name of the Azure Ccontainer Registry instance."
  type        = string
  default     = "acrflowmazonprod"
}

variable "flowmazon_api_managed_identity" {
  description = "Name of the user-assigned maanged identity that would be assigned to the ACA app"
  type = string
  default = "flowmazon_api_managed_identity"
}

locals {
  #repository name of the image in ACR (excluding the
  # '<registry name>.azurecr.io/' prefix and the ':<tag>' suffix)
  image_repository_name="flowmazondotnet-flowmazonbackend"

  # name of the secret whose value is the connection string to be used by the API to connect to the database
  key_vault_secretname_connectionstring_for_api = "flowmazon-db-connection-string-for-api"

}

# Neon DB variables
variable "neon_org_id" {
  description = "The name for the Neon project."
  type        = string
  default     = "org-sweet-cherry-48410063"
}
variable "neon_project_name" {
  description = "The name for the Neon project."
  type        = string
  default     = "flowmazonprod"
}

variable "neon_branch_name" {
  description = "The name for the Neon branch (e.g., 'main' or 'prod')."
  type        = string
  default     = "main"
}

variable "neon_database_name" {
  description = "The name of the database to be created in Neon (e.g., 'flowmazondb')."
  type        = string
  default     = "flowmazondb"
}

# for the following role names,
# bear in mind that in NeonDB roles and users
# are synonymous
variable "neon_app_role" {
  description = "The name for the Neon database role that the application will use."
  type        = string
  sensitive   = true
  default     = "flowmazon_app_user"
}

variable "neon_owner_role" {
  description = "The name for the Neon database owner role."
  type        = string
  sensitive   = true
  default     = "flowmazow_db_owner"

}
