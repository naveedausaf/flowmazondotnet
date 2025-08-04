

module "db_branch" {
  source = "github.com/EnableHub/flowmazondotnet//.iac/modules/db_branch?ref=main"

  managed_identity_name                      = var.managed_identity_name
  managed_identity_resource_group_name       = var.id_and_vault_resource_group_name
  vault_name                                 = var.key_vault_name
  vault_resource_group_name                  = var.id_and_vault_resource_group_name
  vault_secretname_for_connectionstring      = var.vault_secretname_for_connectionstring
  secretname_for_psql_owner_connectionstring = var.secretname_for_psql_owner_connectionstring
  environmentname_for_secrets_and_variables  = var.environmentname_for_secrets_and_variables
  repository_for_secrets_and_variables       = var.repository_for_secrets_and_variables

  neon_project_id       = var.neon_project_id
  neon_source_branch_id = var.neon_source_branch_id
  neon_new_branch_name  = var.neon_new_branch_name
  neon_database_name    = var.neon_database_name
  neon_app_role         = var.neon_app_role
  neon_owner_role       = var.neon_owner_role

}






