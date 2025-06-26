# READ BEST PRACTICES DOCUMENTS for resources created here:
# 1. [Managed identity best practice recommendations](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
# 2. [Azure Container Registry Best Practices](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-best-practices)
# 3. [Best practices for using Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.resource_group_location
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
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization = true
  soft_delete_retention_days = 90
  purge_protection_enabled    = true
}

# By default, access to pull or push content from an Azure container registry is only available to authenticated users. (https://learn.microsoft.com/en-us/azure/container-registry/anonymous-pull-access)
# And since from the pricing table, requests to access the registry are not charged (standard networking charges that apply to ACR, teh only reelvant bit seems egress and ingress here, neither of which would apply to denied unauthorized requests)
# Also, needs access from GitHub ACtions whose ip's do not appear to be stable
# Therefore I wouldn't confgure VNet/NSG for this.
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = false

}


# I don't want the Terraform module that creates Azure Container App
# for the API to create RBAC role assignments for the system-generated
# managed identity of the ACA app.
#
# This is because it would be run by the deployment workflow file for
# Azure container app in GitHbu Actions. I would lock down the 
# identity in Azure (through WiF which is a specialisation of OIDC)
# so that it can assign a manage identity (the one below) to a resource
# but not create role assignments/permission assignments.
#
# This is why I am creating a user-assigned managed identity together 
# with a role with correct role assignments and assgining this identity
# to that role, in this module.
# This module would be executed by a GitHub Actions workflow file
# whose WiF identity would have the permissions to do this in Azure.
# Perhaps this workflow file could be subject to a manual approval 
# in the Production environment (if we have GitHub Pro or higher).
resource "azurerm_user_assigned_identity" "flowmazonapi" {
  location            = azurerm_resource_group.rg.location
  name                = "flowmazon_api_managed_identity"
  resource_group_name = azurerm_resource_group.rg.name
}

# Role `Container Registry Repository Reader` is similar to 
# but less privileged than `AcrPull` and it also 
# support Azure ABAC whereby we can constrain permissions
# to pull a specific image only.
resource "azurerm_role_assignment" "acr_pull_with_abac_condition" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "Container Registry Repository Reader"
  principal_id         = azurerm_user_assigned_identity.flowmazonapi.principal_id

  # The condition block enables ABAC.
  # Version "2.0" is the latest and recommended version.
  condition_version = "2.0"

  # This condition checks if the requested repository name starts with "flowmazon-api/".
  # The @Request attribute is evaluated at the time of the access request.
  condition = "@Request[Microsoft.ContainerRegistry/registries/repositories:name] StringLike '*flowmazondotnet-flowmazonbackend'"
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