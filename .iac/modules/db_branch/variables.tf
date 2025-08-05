# Azure variables

variable "vault_name" {
  description = "The name of the key vault into which the key vault secrets crated by this module would be stored."
  type        = string
}

variable "vault_resource_group_name" {
  description = "The name of the resource group that contains the key vault."
  type        = string
}

variable "vault_secretname_for_connectionstring" {
  description = "name of the secret whose value is the connection string to be used by the API to connect to the database"
  type        = string
}

variable "secretname_for_psql_owner_connectionstring" {
  description = "Name of the GitHub Environment secret in which to store psql connection String that includes credentials of db owner account that would be used to connect to and execute queries (including DDL) on the database from psql."
  type        = string
}

variable "neon_app_role_password" {
  description = "Password of the existing Neon role for app user (whose name is passed into input variable `neon_app_role` in this module). This module will use it to construct connection string for client apps of the database on the Neon project branch that will be created, and store it in a secret whose name is passed in input variable `vault_secretname_for_connectionstring`."
  type        = string
  sensitive   = true

}

variable "neon_owner_role_password" {
  description = "Password of the existing database owner role (whose name is passed into input variable `neon_owner_role` in this module). This module will use it to construct psql connection string (which can be used for migrating the database on the new database branch created by this module), and store it in a secret whose name is passed in input variable `secretname_for_psql_owner_connectionstring`."
  type        = string
  sensitive   = true

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

variable "neon_project_id" {
  description = "project_id of the Neon DB Project in which a new branch would be created by this module. This is also the project that contains the source branch off of which the new branch will be created."
  type        = string
}

variable "neon_source_branch_id" {
  description = "branch_id of the specified Neon DB Project branch from which a new branch would be created by this module."
  type        = string
}

variable "neon_new_branch_name" {
  description = "Name of the new branch that would be created by this module in the specified Neon DB Project."
  type        = string
}

variable "neon_database_name" {
  description = "The name of the database in the specified Neon DB project. Permissions would be assigned in this database to the app role which this module would create on the new branch. Also, connection strings for connecting to this database, from app and owner role respectively which this module would create, would be stored as secrets."
  type        = string
}

# for the following role names,
# bear in mind that in NeonDB roles and users
# are synonymous
variable "neon_app_role" {
  description = "The name for the Neon role that the application will use."
  type        = string
  sensitive   = true
}

variable "neon_owner_role" {
  description = "The name for the Neon owner role which would be used to connect to the specified database over psql (e.g. to run migrations)."
  type        = string
  sensitive   = true
}
