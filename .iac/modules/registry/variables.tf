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


