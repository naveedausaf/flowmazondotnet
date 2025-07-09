# READ BEST PRACTICES DOCUMENTS for resources created here:
# 1. [Managed identity best practice recommendations](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
# 2. [Azure Container Registry Best Practices](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-best-practices)
# 3. [Best practices for using Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)


# Resource group to contain the key vault and the
# user-assigned managed identity that would be created by
# this module.
resource "azurerm_resource_group" "id_and_vault" {
  name     = var.id_and_vault_resource_group_name
  location = var.id_and_vault_resource_group_location
}

# Later on, this user-assigned managed identity can be given 
# permissions on secrets placed in side the keyvault created by 
# this module, and on on other Azure resources created outside
# of this module, such as Azure Container Registry.
# It can then be assigned as the managed identity to services 
# like Aure Container Apps.
resource "azurerm_user_assigned_identity" "identity" {
  location            = azurerm_resource_group.id_and_vault.location
  name                = var.managed_identity_name
  resource_group_name = azurerm_resource_group.id_and_vault.name
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

data "azurerm_container_registry" "registry" {
  name                = var.container_registry_name
  resource_group_name = var.container_registry_resource_group_name
}


# Role `Container Registry Repository Reader` is similar to 
# but less privileged than `AcrPull` and it also 
# support Azure ABAC whereby we can constrain permissions
# to pull a specific image only.
resource "azurerm_role_assignment" "container_registry_reader" {
  scope                = azurerm_container_registry.registry.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.identity.principal_id


  # HAD ISSUES WITH ABAC, so changed role above from
  # 'Container Registry Repository Reader' TO  'AcrPull'
  # and removed the condition below: 
  # TODO: NEED TO REVISIT THIS

  # # The condition block enables ABAC.
  # # Version "2.0" is the latest and recommended version.
  # condition_version = "2.0"

  # # The @Request attribute is evaluated at the time of the access request.
  # condition = "@Request[Microsoft.ContainerRegistry/registries/repositories:name] StringEquals '${var.image_repository_name}'"
}
