output "connectionstring_secret_id" {
  description = "id of the azure key vault secret created by this module in which connection string for the app user is stored."
  value       = azurerm_key_vault_secret.connstr_for_api.id
}

output "owner_connectionstring_for_psql" {
  description = "Connection String that includes credentials ofr db owner account that would be used to connect to and execute queries (including DDL) on the database frmo psql. Expected to be used in GitHub Actions workflows for running migrations on the database."

  # I took the initial value of the connection string (which I 
  # have used as a template and ino which I have substituted  
  # values obtained during terraform apply) by going to NeonDB 
  # Project Dashboard once this module had already run once, 
  # then pressing Connect button, then copying the psql 
  # connection string shown for the default branch of the database
  # of the project.
  value     = "postgresql://${var.neon_owner_role}:${neon_role.owner_role.password}@${neon_project.flowmazon_project.database_host}/${neon_database.flowmazon_db.name}?sslmode=require&channel_binding=require"
  sensitive = true
}
