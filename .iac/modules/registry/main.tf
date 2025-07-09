# READ BEST PRACTICES DOCUMENTS for resources created here:
# 1. [Managed identity best practice recommendations](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
# 2. [Azure Container Registry Best Practices](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-best-practices)
# 3. [Best practices for using Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)


# Resource group to contain the key vault and the
# user-assigned managed identity that would be created by
# this module.
resource "azurerm_resource_group" "container_registry" {
  name     = var.container_registry_resource_group_name
  location = var.container_registry_resource_group_location
}

# By default, access to pull or push content from an Azure container registry is only available to authenticated users. (https://learn.microsoft.com/en-us/azure/container-registry/anonymous-pull-access)
# And since from the pricing table, requests to access the registry are not charged (standard networking charges that apply to ACR, teh only reelvant bit seems egress and ingress here, neither of which would apply to denied unauthorized requests)
# Also, needs access from GitHub ACtions whose ip's do not appear to be stable
# Therefore I wouldn't confgure VNet/NSG for this.
resource "azurerm_container_registry" "container_registry" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.container_registry.name
  location            = azurerm_resource_group.container_registry.location
  sku                 = "Basic"
  admin_enabled       = false

}


