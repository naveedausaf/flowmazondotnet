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
  source                                   = "../../modules/db"
  managed_identity_for_secret_principal_id = module.id_vault.managed_identity_principal_id
  key_vault_id                             = module.id_vault.key_vault_id
  vault_secretname_for_connectionstring    = var.vault_secretname_for_connectionstring
  neon_org_id                              = var.neon_org_id
  neon_project_name                        = var.neon_project_name
  neon_branch_name                         = var.neon_branch_name
  neon_database_name                       = var.neon_database_name
  neon_app_role                            = var.neon_app_role
  neon_owner_role                          = var.neon_owner_role


}

module "flowmazonfrontend" {
  source                                  = "../../modules/flowmazonfrontend"
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

}

module "cloudflare_rate_limiting_rule" {
  source                         = "../../modules/cloudflare_rate_limiting_rule"
  cloudflare_api_token           = var.cloudflare_api_token
  cloudflare_zone_id             = var.cloudflare_zone_id
  rate_limit_requests_per_period = 30

}
