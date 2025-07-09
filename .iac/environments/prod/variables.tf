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

variable "vault_secretname_for_connectionstring" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

# /health/live /health/ready
variable "app_container_liveness_probe" {
  description = "The pathname (starting with `/`) of the Liveness probe for the container (e.g. an endpoint `/health/live` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
}

variable "app_container_readiness_probe" {
  description = "The pathname (starting with `/`) of the Readiness probe for the container (e.g. an endpoint `/health/ready` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
  type        = string
}
variable "app_container_startup_probe" {
  description = "The pathname (starting with `/`) of the Startup probe for the container (e.g. an endpoint `/health/startup` implemented by the app running in the container). For more details see https://learn.microsoft.com/en-us/azure/container-apps/health-probes?tabs=arm-template"
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

variable "image_version_tag" {
  description = "SemVer version to deploy, starting with 'v'. this would be the tag of the image for flowmazonapi in the container registry e.g. `v1.0.1`"
  type        = string
}
