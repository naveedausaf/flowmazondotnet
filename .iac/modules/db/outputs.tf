output "connectionstring_secret_id" {
  description = "id of the azure key vault secret created by this module in which connection string for the app user is stored."
  value       = azurerm_key_vault_secret.connstr_for_api.id
}
