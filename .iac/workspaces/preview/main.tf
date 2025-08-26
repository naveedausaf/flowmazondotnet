# To save on the cost of an Azure Container Registry instance,
# this workspace wll not create an ACR instance. 
# Instead, the GitHUb Actions CI workflow would deploy API image
# to GitHub Pacakges of rht repo. The latest of these would be
# deployed by preview-api workspace to the ACA app for the API.

module "id_vault" {
  source                                  = "../../modules/id_vault"
  key_vault_name                          = var.key_vault_name
  managed_identity_name                   = var.managed_identity_name
  id_and_vault_resource_group_name        = var.id_and_vault_resource_group_name
  id_and_vault_resource_group_location    = var.id_and_vault_resource_group_location
  assign_permission_on_container_registry = false
}

module "db" {
  source                                        = "../../modules/db"
  managed_identity_for_secret_principal_id      = module.id_vault.managed_identity_principal_id
  key_vault_id                                  = module.id_vault.key_vault_id
  vault_secretname_for_connectionstring         = var.vault_secretname_for_connectionstring
  neon_org_id                                   = var.neon_org_id
  neon_project_name                             = var.neon_project_name
  neon_branch_name                              = var.neon_branch_name
  neon_database_name                            = var.neon_database_name
  neon_app_role                                 = var.neon_app_role
  neon_owner_role                               = var.neon_owner_role
  secretname_for_psql_owner_connectionstring    = var.secretname_for_psql_owner_connectionstring
  secretname_for_neon_app_role_password         = var.secretname_for_neon_app_role_password
  secretname_for_neon_owner_role_password       = var.secretname_for_neon_owner_role_password
  secretname_for_neon_project_id                = var.secretname_for_neon_project_id
  secretname_for_neon_project_default_branch_id = var.secretname_for_neon_project_default_branch_id
  environmentname_for_secrets_and_variables     = var.environmentname_for_secrets_and_variables
  repository_for_secrets_and_variables          = var.repository_for_secrets_and_variables


}


module "cloudflare_rate_limiting_rule" {
  source                         = "../../modules/cloudflare_rate_limiting_rule"
  cloudflare_api_token           = var.cloudflare_api_token
  cloudflare_zone_id             = var.cloudflare_zone_id
  rate_limit_requests_per_period = 30

}

# register the Microsoft.App provider that is needed to create 
# an instance of Azure Container Apps environment.
# Even though the service principal TF uses has permission
# to register any resource providers it needs, it it somehow
# fails to register this one.
resource "azurerm_resource_provider_registration" "aca_app_env_provider_registration" {
  name = "Microsoft.App"
}
