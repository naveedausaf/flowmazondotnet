output "vercel_project_id" {
  value     = module.flowmazonfrontend.vercel_project_id
  sensitive = true
}

output "owner_connectionstring_for_psql" {
  description = "Connection String that includes credentials ofr db owner account that would be used to connect to and execute queries (including DDL) on the database frmo psql. Expected to be used in GitHub Actions workflows for running migrations on the database."

  value     = module.db.owner_connectionstring_for_psql
  sensitive = true
}
