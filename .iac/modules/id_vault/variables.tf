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

variable "container_registry_name" {
  description = "Name of the Azure Container Registry instance on which the created User-assigned Managed Identity would be assigned image pull premission."
  type        = string
}

variable "container_registry_resource_group_name" {
  description = "Name of the resource group in which the Azure container Registry instance lives."
  type        = string
}


