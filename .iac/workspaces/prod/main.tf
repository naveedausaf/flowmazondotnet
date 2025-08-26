module "registry" {
  source                                     = "../../modules/registry"
  container_registry_name                    = var.acr_name
  container_registry_resource_group_name     = var.acr_resource_group_name
  container_registry_resource_group_location = var.acr_resource_group_location

}

module "id_vault" {
  source                                  = "../../modules/id_vault"
  key_vault_name                          = var.key_vault_name
  managed_identity_name                   = var.managed_identity_name
  id_and_vault_resource_group_name        = var.id_and_vault_resource_group_name
  id_and_vault_resource_group_location    = var.id_and_vault_resource_group_location
  assign_permission_on_container_registry = true
  container_registry_id                   = module.registry.registry_id
}

module "db" {
  source                                        = "../../modules/db"
  managed_identity_for_secret_principal_id      = module.id_vault.managed_identity_principal_id
  key_vault_id                                  = module.id_vault.key_vault_id
  vault_secretname_for_connectionstring         = var.vault_secretname_for_connectionstring
  secretname_for_psql_owner_connectionstring    = var.secretname_for_psql_owner_connectionstring
  secretname_for_neon_project_id                = var.secretname_for_neon_project_id
  secretname_for_neon_project_default_branch_id = var.secretname_for_neon_project_default_branch_id
  secretname_for_neon_app_role_password         = var.secretname_for_neon_app_role_password
  secretname_for_neon_owner_role_password       = var.secretname_for_neon_owner_role_password
  environmentname_for_secrets_and_variables     = var.environmentname_for_secrets_and_variables
  repository_for_secrets_and_variables          = var.repository_for_secrets_and_variables
  neon_org_id                                   = var.neon_org_id
  neon_project_name                             = var.neon_project_name
  neon_branch_name                              = var.neon_branch_name
  neon_database_name                            = var.neon_database_name
  neon_app_role                                 = var.neon_app_role
  neon_owner_role                               = var.neon_owner_role


}

module "flowmazonfrontend" {
  source                                                 = "../../modules/flowmazonfrontend"
  vercel_team_id                                         = var.vercel_team_id
  vercel_project_name                                    = var.vercel_project_name
  vercel_app_domain_name                                 = var.vercel_app_domain_name
  vercel_region_for_server_side_execution                = var.vercel_region_for_server_side_execution
  cloudflare_api_token                                   = var.cloudflare_api_token
  cloudflare_zone_id                                     = var.cloudflare_zone_id
  env_NEXT_PUBLIC_OTEL_ENVIRONMENT                       = var.env_NEXT_PUBLIC_OTEL_ENVIRONMENT
  env_OTEL_EXPORTER_OTLP_ENDPOINT                        = var.env_OTEL_EXPORTER_OTLP_ENDPOINT
  env_OTEL_EXPORTER_OTLP_PROTOCOL                        = var.env_OTEL_EXPORTER_OTLP_PROTOCOL
  env_OTEL_EXPORTER_OTLP_HEADERS                         = var.env_OTEL_EXPORTER_OTLP_HEADERS
  secretname_for_vercel_project_id                       = var.secretname_for_vercel_project_id
  environmentname_for_secrets_and_variables              = var.environmentname_for_secrets_and_variables
  repository_for_secrets_and_variables                   = var.repository_for_secrets_and_variables
  grafanacloud_frontend_o11y_api_access_token            = var.grafanacloud_frontend_o11y_api_access_token
  grafanacloud_stack_slug                                = var.grafanacloud_stack_slug
  grafanacloud_frontend_o11y_instance_name               = var.grafanacloud_frontend_o11y_instance_name
  secretname_for_grafanacloud_frontend_o11y_instance_url = var.secretname_for_grafanacloud_frontend_o11y_instance_url


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
# Putting it in this workspace as this workspace needs to run/
# be created before prod-api workspace that created the ACA
# environment which would require this resource provider
# to be registered.
resource "azurerm_resource_provider_registration" "aca_app_env_provider_registration" {
  name = "Microsoft.App"
}
