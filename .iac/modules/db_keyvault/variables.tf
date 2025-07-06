# Azure variables

variable "core_resource_group_name" {
  description = "The name of the Azure resource group."
  type        = string
  default     = "rg-core"
}

variable "core_resource_group_location" {
  description = "The name of the Azure resource group."
  type        = string
  default     = "East US 2"
}

variable "key_vault_name" {
  description = "The name of the key vault."
  type        = string
  default     = "keyvaultflowmazonprod"
}

variable "acr_name" {
  description = "The name of the Azure Ccontainer Registry instance."
  type        = string
  default     = "acrflowmazonprod"
}

variable "flowmazon_api_managed_identity" {
  description = "Name of the user-assigned maanged identity that would be assigned to the ACA app"
  type        = string
  default     = "flowmazon_api_managed_identity"
}

variable "image_repository_name" {
  description = "Name of the Docker image to deploy (excluding the '<registry name>.azurecr.io/' prefix and the ':<tag>' suffix)"
  type        = string
}

variable "key_vault_secretname_connectionstring_for_api" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

# Neon DB variables

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
