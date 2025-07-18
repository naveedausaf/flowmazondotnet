output "key_vault_id" {
  description = "id of the created Azure Key Vault instance created by the module."
  value       = azurerm_key_vault.vault.id
}

output "managed_identity_principal_id" {
  description = "principal_id of the user-assigned managed identity created by the module."
  value       = azurerm_user_assigned_identity.identity.principal_id
}

output "managed_identity_id" {
  description = "id of the user-assigned managed identity created by the module."
  value       = azurerm_user_assigned_identity.identity.id
}
