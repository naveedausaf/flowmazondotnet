output "registry_id" {
  description = "The ID of the Azure Container Registry created by this module."
  value       = azurerm_container_registry.container_registry.id
}

output "registry_login_server" {
  description = "login_sever of the Azure Contianer Registry created by this module."
  value       = azurerm_container_registry.container_registry.login_server
}
