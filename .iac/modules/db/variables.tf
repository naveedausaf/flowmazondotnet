# Azure variables

variable "key_vault_id" {
  description = "id of the Azure Key Vault into which the connection string of the created database would be stored."
  type        = string
}

variable "managed_identity_for_secret_principal_id" {
  description = "principal_id of the user-assigned maanged identity that would be assigned permission to read the conenction string that would be stored in the key vault as a secret."
  type        = string
}

variable "vault_secretname_for_connectionstring" {
  description = "name of the Azure Key Vault secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

variable "secretname_for_psql_owner_connectionstring" {
  description = "Name of the GitHub Environment secret in which to store psql connection String that includes credentials of db owner account that would be used to connect to and execute queries (including DDL) on the database from psql."
  type        = string
}

variable "secretname_for_neon_project_default_branch_id" {
  description = "Name of the secret in GitHub Environment in which to store default branch id of the Neon DB project that would be created."
  type        = string
}

variable "secretname_for_neon_project_id" {
  description = "Name of the secret in GitHub Environment in which to store project id of the Neon DB project that would be created."
  type        = string
}



variable "environmentname_for_secrets_and_variables" {
  description = "Name of GitHub repo Environment in which to store secrets and variables such as psql_owner_connection_string."
  type        = string
}

variable "repository_for_secrets_and_variables" {
  description = "Name of GitHub repo in an an Environment of which (specified by `environmentname_for_secrets_and_variables` argument) secrets and variables such as psql_owner_connection_string would be stored. This should just be the repo's name, and NOT prefixed by account name or organisation name and NOT a fully qualified repo name either. Otherwise the repo may not be found. For example I would provide `flowmazondotnet` as the repo name instead of `EnableHub/flowmazondotnet` or `https://github.com/EnableHub/flowmazondotnet`."
  type        = string
}

# Neon DB variables

# This can be found on Settings page in the Neon DB UI
variable "neon_org_id" {
  description = "Organization ID of the Neon Organization in which the new project would be created."
  type        = string
  sensitive   = true
}


variable "neon_project_name" {
  description = "The name for the Neon project that would be created."
  type        = string
}

variable "neon_branch_name" {
  description = "The name for the default Neon branch for the project (e.g., 'main' or 'prod')."
  type        = string
}

variable "neon_database_name" {
  description = "The name of the database to be created in Neon (e.g., 'flowmazondb')."
  type        = string
}

# for the following role names,
# bear in mind that in NeonDB roles and users
# are synonymous
variable "neon_app_role" {
  description = "The name for the Neon database role that the application will use."
  type        = string
  sensitive   = true
}

variable "neon_owner_role" {
  description = "The name for the Neon database owner role."
  type        = string
  sensitive   = true
}

