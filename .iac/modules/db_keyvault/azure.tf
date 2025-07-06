# READ BEST PRACTICES DOCUMENTS for resources created here:
# 1. [Managed identity best practice recommendations](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
# 2. [Azure Container Registry Best Practices](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-best-practices)
# 3. [Best practices for using Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)

resource "azurerm_resource_group" "core" {
  name     = var.core_resource_group_name
  location = var.core_resource_group_location
}

data "azurerm_client_config" "current" {}

# Every authenticated request counts as one operation.
# Since authentication has to go through Entra, only
# users in my Entra instance can make requests (authorized
# or not) that count as billable operations.
# So I am not worried about being charged by malicious requests.
# Plus needs access from GitHub ACtions whose IPs are unstable.
# So I won't configure its firewall (like Azure SQL and unlike
# ACR, key vault has its own firewall which can be configured)
resource "azurerm_key_vault" "vault" {
  name                       = var.key_vault_name
  location                   = azurerm_resource_group.core.location
  resource_group_name        = azurerm_resource_group.core.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization  = true
  soft_delete_retention_days = 90
  purge_protection_enabled   = true
}




# Access Policies aer a legacy authorization model in Azure Key Vault
# So using Azure RBAC which is now the recommendation
# RBAC for Vault also allows key/secret/certificate-level access control
# role and scope chosen based on this page and app requirements:
# https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli
resource "azurerm_role_assignment" "connstr_for_flowmazonapi" {
  scope                = azurerm_key_vault.vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.flowmazonapi.principal_id

}
