data "azurerm_resource_group" "vault" {
  name = var.vault_resource_group_name

}

data "azurerm_key_vault" "vault" {
  name                = var.vault_name
  resource_group_name = data.azurerm_resource_group.vault.name
}

resource "neon_branch" "new_branch" {

  project_id = var.neon_project_id
  name       = var.neon_new_branch_name
  parent_id  = var.neon_source_branch_id
}

# We need to create a neon_endpoint for the new branch
# in order to get a connection string to read/write to it.
# There can only be one read/write endpoint (but multiple
# read-only ones). See this link for details:
#
# https://neon.com/docs/reference/terraform#managing-endpoints

resource "neon_endpoint" "new_branch" {
  project_id = var.neon_project_id
  branch_id  = neon_branch.new_branch.id
  type       = "read_write" # "read_write" or "read_only"
  # autoscaling_limit_min_cu = 0.25
  # autoscaling_limit_max_cu = 0.5
  # suspend_timeout_seconds  = 600
  # Optional: Enable connection pooling
  # pooler_enabled = true
}

# PostgreSQL Permissions Setup does not need to be done 
# again as the two users created and the permissions
# assigned to app user on the source branch of the database
# would carry over to the branch we just created.
#
# Hwoever, we do want to create app and (for owner role)
# psql connection strings for the app and owner roles
# respectively but which contain the host name of the 
# new branch's endpoint. These would be used to connect
# to the database named in input variable `neon_database_name`.
# We would store these connection strings as secrets.

# First, put app conncetionstring into key vault as a secret.
#
# NOTE: we do not need to assign permissions to the managed 
# identity on this secret as the module that created
# the vault and id would already have assigned permissions to 
# the managed identity on all secrets in the key vault.
resource "azurerm_key_vault_secret" "connstr_for_api" {
  name = var.vault_secretname_for_connectionstring

  key_vault_id = data.azurerm_key_vault.vault.id
  value        = "Server=${neon_endpoint.new_branch.host};Port=5432;Database=${var.neon_database_name};User Id=${var.neon_app_role};Password=${var.neon_app_role_password}"

}

# Second, create Github Environment secret for psql 
# connection string (for owner role)
resource "github_actions_environment_secret" "psql_owner_connection_string" {
  repository      = var.repository_for_secrets_and_variables
  environment     = var.environmentname_for_secrets_and_variables
  secret_name     = var.secretname_for_psql_owner_connectionstring
  plaintext_value = "postgresql://${var.neon_owner_role}:${var.neon_owner_role_password}@${neon_endpoint.new_branch.host}/${var.neon_database_name}?sslmode=require&channel_binding=require"
}
