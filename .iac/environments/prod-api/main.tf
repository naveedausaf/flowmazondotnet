module "aca_app" {
  source                                = "../../modules/aca_app"
  app_resource_group_name               = var.app_resource_group_name
  app_resource_group_location           = var.app_resource_group_location
  app_name                              = var.app_name
  app_environment_name                  = var.app_environment_name
  app_domain_name                       = var.app_domain_name
  app_container_name                    = var.app_container_name
  app_container_port                    = var.app_container_port
  app_container_liveness_probe          = var.app_container_liveness_probe
  app_container_readiness_probe         = var.app_container_readiness_probe
  app_container_startup_probe           = var.app_container_startup_probe
  image_login_server                    = module.registry.registry_login_server
  image_repository                      = var.image_repository
  image_tag                             = var.image_tag
  app_revision_mode                     = "Multiple"
  managed_identity_id                   = module.id_vault.managed_identity_id
  key_vault_id                          = module.id_vault.key_vault_id
  vault_secretname_for_connectionstring = var.vault_secretname_for_connectionstring
  vault_secretid_for_connectionstring   = module.db.connectionstring_secret_id
  allowed_cors_origins_for_api          = var.allowed_cors_origins_for_api
  cloudflare_api_token                  = var.cloudflare_api_token
  cloudflare_zone_id                    = var.cloudflare_zone_id
  rate_limit_requests_per_period        = var.rate_limit_requests_per_period

  providers = {
    restful.cloudflare = restful.cloudflare
  }
}
