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
  name                = var.app-environment-name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

}

# returns cloudflare's ip ranges
# so we can add them to ingress allow rules
# in ACA app
data "cloudflare_ip_ranges" "cloudflare" {}

locals {

  # Create a map of Cloudflare IPv4 IPs where the key is 
  # the index that we can use in constructing unique 
  # firewall rule names 
  # and value is a CloufFlare ip address
  cloudflare_ips = toset(data.cloudflare_ip_ranges.cloudflare.ipv4_cidrs)
}

resource "azurerm_container_app" "acaapp" {
  name                         = var.app-name
  container_app_environment_id = azurerm_container_app_environment.acaenv.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Multiple"

  ingress {
    external_enabled           = true
    allow_insecure_connections = false
    target_port                = 8080
    #client_certificate_mode    = "require"

    dynamic "ip_security_restriction" {
      for_each = local.cloudflare_ips

      content {
        # want to generate a unique name for the 
        # ip range. Better practice with dynamically
        # generated blocks to do this than to 
        # assign index 1...n that we could have
        # done with count instead of for-each
        # as we have done in this dynamic block
        name             = "Allow-Cloudflare-${replace(replace(replace(ip_security_restriction.value, ".", "-"), ":", "--"), "/", "_")}"
        description      = "One of the CloudFlare's outbound IP ranges. Part of a fairly stable set."
        ip_address_range = ip_security_restriction.value
        action           = "Allow"
      }
    }

    traffic_weight {
      latest_revision = true
      percentage      = 100
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
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [data.azurerm_user_assigned_identity.aca_app_managed_identity.id]

  }

  template {
    container {
      name   = "flowmazonapi"
      image  = "${local.acr_hostname}/${local.image_repository_name}:${var.version_to_deploy}"
      cpu    = 0.5
      memory = "1Gi"
      env {
        name  = local.allowed_cors_origins_env_var_name
        value = var.allowed_cors_origins_for_api
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

# Create DNS settings in CloudFlare

# PREREQUISITE: CloudFlare's namesrevers should already been rwgistered 
# with the Domain Name Registrar you bought the domain name from.
# This would have created a Zone in CLoudFlare for your apex domain
# e.g. `efast.uk`
#
# Assuming the apex domain is `efast.uk` and I want to map
# `api.efast.uk` to the ACA app, we need the following two items
# from the contianer app, once it has been created:
#
# 1. azurerm_container_app.acaapp.custom_domain_verification_id is the TXT rcord. We need to specify `asuid.<subdomain>` e.g. `asuid.api` as the host.
#
# 2. azurerm_cotnainer_app.ingress[0].fqdn is the FQDN we need to create the CNAME record against. To use it we need to provide `<subdomain>` e.g. `api`, as the host

locals {
  subdomain                     = split(".", var.api_domain_name)[0]                              # e.g., 'api' for 'api.efast.uk'
  apexdomain                    = trimprefix(var.api_domain_name, format("%s.", local.subdomain)) # e.g., 'efast.uk'
  custom_domain_verification_id = azurerm_container_app.acaapp.custom_domain_verification_id


}

# To map the API's domain name to your ACA app, we need to create
# a CNAME record and a TXT record for the subdomain (`api`) of the
# desired domain name (e.g. `api.efast.uk`) 
# in the CloudFlare zone for the apex domain name (e.g. `efast.uk`)

resource "cloudflare_dns_record" "acaapp_cname" {
  zone_id = "9aaa4b8d7f9f3fd24aa6e98906686272"
  name    = local.subdomain

  # this should be the target FQDN without the `https://` prefix
  # which is how ingress's fqdn property returns it
  content = azurerm_container_app.acaapp.ingress[0].fqdn
  type    = "CNAME"
  ttl     = 1
  proxied = false # we want it proxied through CloudFlare
}

resource "cloudflare_dns_record" "acaapp_txt" {
  zone_id = "9aaa4b8d7f9f3fd24aa6e98906686272"
  name    = format("%s.%s", "asuid", local.subdomain)
  # content of TXT record must be contained within quotes
  content = format("\"%s\"", local.custom_domain_verification_id)
  type    = "TXT"
  ttl     = 1
}


# bits below from this Gist:
# https://gist.github.com/fdelu/25f4eee056633abc03dc87b4a7e7704b

# First we wait for the DNS records to have propagated
resource "time_sleep" "dns_propagation" {
  create_duration = "60s"

  depends_on = [cloudflare_dns_record.acaapp_cname]

  triggers = {
    targetfqdn  = cloudflare_dns_record.acaapp_cname.content
    modified_on = cloudflare_dns_record.acaapp_cname.modified_on
  }
}

# Create a managed certificate
# and map the custom domain using it on the ACA app.
#
# This can only be done after DNS entries for CNAME
# and TXT have been created in CloudFlare
#
# Without this, CloudFlare will return an SSL handshake error
# (I have verified this: it's not enough just to take the 
# FQDN of the ingress and create a CNAME record for it
# in CloudFLare zone for your apex domain together with a 
# TXT record)
resource "azurerm_container_app_custom_domain" "acaapp" {
  name             = var.api_domain_name
  container_app_id = azurerm_container_app.acaapp.id


  lifecycle {
    // When using an Azure created Managed Certificate these values must be added to ignore_changes to prevent resource recreation.
    ignore_changes = [certificate_binding_type, container_app_environment_certificate_id]
  }
  depends_on = [cloudflare_dns_record.acaapp_cname, cloudflare_dns_record.acaapp_txt, time_sleep.dns_propagation]
}

# azurerm can't create a managed TLS certificate - see https://github.com/hashicorp/terraform-provider-azurerm/issues/21866
# The following resources are the workaround

# resource "azapi_update_resource" "custom_domain" {
#   type        = "Microsoft.App/containerApps@2023-05-01"
#   resource_id = azurerm_container_app.app.id

#   body = jsonencode({
#     properties = {
#       ingress = {
#         customDomains = [
#           {
#             bindingType = "Disabled",
#             name        = time_sleep.dns_propagation.triggers["url"],
#           }
#         ]
#       }
#     }
#   })
# }

resource "azapi_resource" "managed_certificate" {
  depends_on = [azurerm_container_app_custom_domain.acaapp]
  type       = "Microsoft.App/ManagedEnvironments/managedCertificates@2023-05-01"
  name       = "${lower(var.app-environment-name)}-${lower(var.app-name)}-cert"
  parent_id  = azurerm_container_app_environment.acaenv.id
  location   = azurerm_resource_group.rg.location

  body = {
    properties = {
      subjectName             = var.api_domain_name
      domainControlValidation = "CNAME"
    }
  }

  response_export_values = ["*"]
}

resource "azapi_update_resource" "custom_domain_binding" {
  type        = "Microsoft.App/containerApps@2023-05-01"
  resource_id = azurerm_container_app.acaapp.id


  body = {
    properties = {
      ingress = {
        customDomains = [
          {
            bindingType   = "SniEnabled",
            name          = var.api_domain_name,
            certificateId = jsondecode(azapi_resource.managed_certificate.output).id
          }
        ]
      }
    }
  }
}

# output variables for testin
#TODO: remove when done
# output "custom_domain_verification_id" {
#   value     = local.custom_domain_verification_id
#   sensitive = true
# }

# output "subdomain" {
#   value = local.subdomain
# }


