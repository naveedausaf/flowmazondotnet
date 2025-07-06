resource "azurerm_resource_group" "registry" {
  name     = var.registry_resource_group_name
  location = var.registry_resource_group_location
}

# By default, access to pull or push content from an Azure container registry is only available to authenticated users. (https://learn.microsoft.com/en-us/azure/container-registry/anonymous-pull-access)
# And since from the pricing table, requests to access the registry are not charged (standard networking charges that apply to ACR, teh only reelvant bit seems egress and ingress here, neither of which would apply to denied unauthorized requests)
# Also, needs access from GitHub ACtions whose ip's do not appear to be stable
# Therefore I wouldn't confgure VNet/NSG for this.
resource "azurerm_container_registry" "core" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.core.name
  location            = azurerm_resource_group.core.location
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
  location            = azurerm_resource_group.core.location
  name                = var.flowmazon_api_managed_identity
  resource_group_name = azurerm_resource_group.core.name
}

# Role `Container Registry Repository Reader` is similar to 
# but less privileged than `AcrPull` and it also 
# support Azure ABAC whereby we can constrain permissions
# to pull a specific image only.
resource "azurerm_role_assignment" "acr_pull_with_abac_condition" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.flowmazonapi.principal_id

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


