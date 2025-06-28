data "azurerm_resource_group" "supporting_rg" {
  name = var.supporting_resource_group_name

}

data "azurerm_user_assigned_identity" "aca_app_managed_identity" {
  name                = var.flowmazon_api_managed_identity
  resource_group_name = data.azurerm_resource_group.supporting_rg.name
}

data "azurerm_key_vault" "vault" {
  name                = var.key_vault_name
  resource_group_name = data.azurerm_resource_group.supporting_rg.name
}

data "azurerm_key_vault_secret" "connstr_for_api" {
  name         = local.key_vault_secretname_connectionstring_for_api
  key_vault_id = data.azurerm_key_vault.vault.id
}

# TODO: add data source for ACR then use that in constructing image name


resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.resource_group_location
}

resource "azurerm_container_app_environment" "acaenv" {
  name                       = var.app-environment-name
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  
}

resource "azurerm_container_app" "acaapp" {
  name                         = var.app-name
  container_app_environment_id = azurerm_container_app_environment.acaenv.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Multiple"

    ingress {
     external_enabled  = true
      allow_insecure_connections = false
      target_port   = 8080
      client_certificate_mode = "accept"
      traffic_weight {
        latest_revision = true
        percentage = 100
      }
    }
  registry {
    server   = local.acr_hostname
    identity = data.azurerm_user_assigned_identity.aca_app_managed_identity.id
  }

  secret {
    name                = local.key_vault_secretname_connectionstring_for_api
    identity            = data.azurerm_user_assigned_identity.aca_app_managed_identity.id
    key_vault_secret_id = data.azurerm_key_vault_secret.connstr_for_api.id
  }

  identity {
    type = "SystemAssigned, UserAssigned"
    identity_ids = [data.azurerm_user_assigned_identity.aca_app_managed_identity.id]

  }

  template {
    container {
      name   = "flowmazonapi"
      image  = "${local.acr_hostname}/${local.image_repository_name}:${var.version_to_deploy}"
      cpu    = 1.0
      memory = "2Gi"
      env {
        name  = local.allowed_cors_origins_env_var_name
        value = "${var.allowed_cors_origins_for_api}"
      }
      env {
        name = local.connection_string_env_var_name
        # We don't want to set it from the value of the secret
        # read from key vault (the account executing this terraform
        # config may not even have the permission to do that).value
        #
        # If we did that, the value would be visible in 
        # Environment Variables section of the app in plain text
        #
        # Therefore we simply provide the name of the secret
        # we want the value to be retrieved from.
        #
        # For this to work, we need to reference the secret
        # in a secret object in the app object (done above),
        # which in turn requries a reference to a
        # azurerm_key_vault_secret data source and for that a
        # azurerm_key_vault data source.
        secret_name = local.key_vault_secretname_connectionstring_for_api
      }

      # TODO: add /health/ready as readineness_probe

      # TODO: add /health/live as both liveness_probe and startup_probe
    }
  }
}