module "flowmazonfrontend" {
  source = "github.com/EnableHub/flowmazondotnet//.iac/modules/flowmazonfrontend?ref=main"

  vercel_team_id                          = var.vercel_team_id
  vercel_project_name                     = var.vercel_project_name
  vercel_app_domain_name                  = var.vercel_app_domain_name
  vercel_region_for_server_side_execution = var.vercel_region_for_server_side_execution
  cloudflare_api_token                    = var.cloudflare_api_token
  cloudflare_zone_id                      = var.cloudflare_zone_id
  env_NEXT_PUBLIC_OTEL_ENVIRONMENT        = var.env_NEXT_PUBLIC_OTEL_ENVIRONMENT
  env_OTEL_EXPORTER_OTLP_ENDPOINT         = var.env_OTEL_EXPORTER_OTLP_ENDPOINT
  env_OTEL_EXPORTER_OTLP_PROTOCOL         = var.env_OTEL_EXPORTER_OTLP_PROTOCOL
  env_OTEL_EXPORTER_OTLP_HEADERS          = var.env_OTEL_EXPORTER_OTLP_HEADERS
  secretname_for_vercel_project_id        = var.secretname_for_vercel_project_id
  environmentname_for_vercel_project_id   = var.environmentname_for_secrets_and_variables
  repository_for_vercel_project_id        = var.repository_for_secrets_and_variables

  grafanacloud_frontend_o11y_api_access_token            = var.grafanacloud_frontend_o11y_api_access_token
  grafanacloud_stack_slug                                = var.grafanacloud_stack_slug
  grafanacloud_frontend_o11y_instance_name               = var.grafanacloud_frontend_o11y_instance_name
  secretname_for_grafanacloud_frontend_o11y_instance_url = var.secretname_for_grafanacloud_frontend_o11y_instance_url

}

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






