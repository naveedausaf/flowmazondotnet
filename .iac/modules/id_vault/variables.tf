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

variable "assign_permission_on_container_registry" {
  description = "Wether or not to assign AcrPull permission to the specified managed identity on a specified Azure Container Registry. If true, then a non-null value must be provided for `container_registry_id` argument."
  type        = bool
  default     = false
}

variable "container_registry_id" {
  description = "ID of the Azure Container Registry instance on which the created User-assigned Managed Identity would be assigned image pull permission."
  type        = string
  # nullable    = true # nullable is true by default
  default = null
}


