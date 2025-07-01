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

# TODO: put in "require certificate in ACA" then update CloudFlare
# to present cert to origin (I know how to do this manually in 
# CloudFlare's UI)

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

  lifecycle {
    # we would be updating custom_domain shortly.
    # Therefore we need to tell the resource
    # to ignore its changed value.
    #
    # In fact we update custom_domain twice in this file:
    #
    # First a custom domain is created in the ingress.
    # This is ony possible after DNS CNAME record 
    # has been created with CloudFlare AND has propapagated.
    #
    # Then we create update the custom_domain
    # with managed certificate.
    # 
    # Reasons for this rather complicated sequencing are
    # given in other comments below.
    ignore_changes = [ingress.0.custom_domain]
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

# TODO: Read the xoneid dynamicall, perhaps using
# data source in cloudflare provider
# TODO: Also read an yother bits from data sources
# that I am currently reading from vars (thoug hnothing is 
# hardcoded other than zone_id I believe)
resource "cloudflare_dns_record" "acaapp_cname" {

  zone_id = "9aaa4b8d7f9f3fd24aa6e98906686272"
  name    = var.api_domain_name

  # this should be the target FQDN without the `https://` prefix
  # which is how ingress's fqdn property returns it
  content = azurerm_container_app.acaapp.ingress[0].fqdn
  type    = "CNAME"
  ttl     = 1

  # this is safe to do as we have already restricted
  # traffic only to CloudFalre IP addresses.
  # We are leaving it off for a blip because 
  # if it is on, managed certificate verification
  # would faile because it would not be able to verify
  # the CNAME/TXT records with CloudFlare.
  # As soon as managed certificate creation has 
  # completed we would turn it on with a provisioner.
  proxied = false
  lifecycle {
    ignore_changes = [proxied]
  }

}

resource "cloudflare_dns_record" "acaapp_txt" {
  zone_id = "9aaa4b8d7f9f3fd24aa6e98906686272"
  name    = format("%s.%s", "asuid", var.api_domain_name)
  # content of TXT record must be contained within quotes
  content = format("\"%s\"", local.custom_domain_verification_id)
  type    = "TXT"
  ttl     = 1
}


# bits below from this Gist:
# https://gist.github.com/fdelu/25f4eee056633abc03dc87b4a7e7704b

# First we wait for the DNS records to have propagated
resource "time_sleep" "cname_and_txt_propagated" {
  create_duration = "60s"

  depends_on = [cloudflare_dns_record.acaapp_cname, cloudflare_dns_record.acaapp_txt]

  triggers = {
    # TODO: see if there's a way of putting the entier
    # dns record resource here. 
    targetfqdn                    = cloudflare_dns_record.acaapp_cname.content
    sourcefqdn                    = var.api_domain_name
    custom_domain_verification_id = local.custom_domain_verification_id
  }
}

# Create a custom domain for the ACA app
# If we don't do this before we create the managed cert
# (which, as described above can only be done using AzAPI 
# provider), then managed cert creation will fail with 
# error:
#
# RESPONSE 400: 400 Bad Request
# │ ERROR CODE: RequireCustomHostnameInEnvironment
#
# We then need to go go back and update the this resource
# with managed crt's id, which is why " block
# contins "ignore_changes" for fields related to managed
# cert.
# resource "azurerm_container_app_custom_domain" "acaapp" {

#   # This resource can only be created after DNS entries for CNAME
#   # and TXT have been created in CloudFlare otherwise
#   # validation would fail (either here or when creating
#   # the managed cert; not sure which of the two places
#   # it would fail but I have seen it happen both here
#   # in terraform and in Azure portal)
#   depends_on = [time_sleep.cname_and_txt_propagated]

#   name             = var.api_domain_name
#   container_app_id = azurerm_container_app.acaapp.id


#   lifecycle {
#     // When using an Azure created Managed Certificate these values must be added to ignore_changes to prevent resource recreation.
#     ignore_changes = [certificate_binding_type, container_app_environment_certificate_id]
#   }
# }

# Before I put this in, I was using 
# "azurerm_container_app_custom_domain" resource with 
# azurerm provider version 4.34.0.
# Fiddler showed that instead of a PATCH with the small
# request body that you are seeing below, it was doing a
# PUT (meaning "create or update" to Azure API) and sent
# the entire app's JSON including all the stuff 
# configured above. 
# This was a big JSON document and to get
# it first, it would probabaly also have done a GET.
#
# TOO INEFFICIENT!
#
# Hence I am back to using the 
# resource below from the Gist linked above.
resource "azapi_update_resource" "custom_domain" {
  depends_on = [time_sleep.cname_and_txt_propagated]

  type        = "Microsoft.App/containerApps@2023-05-01"
  resource_id = azurerm_container_app.acaapp.id

  body = {
    properties = {
      configuration = {
        ingress = {
          customDomains = [
            {
              bindingType = "Disabled",
              name        = var.api_domain_name,
            }
          ]
        }
      }
    }
  }
}

# azurerm can't create a managed TLS certificate - see https://github.com/hashicorp/terraform-provider-azurerm/issues/21866
# Secondly, to create a cert, we need to have created a Custom Domain
# for the container app (this goes in the app's HTTP ingress I am quite sure).
# Therefore we need to go back and update this custom domain with the newly
# created cert.
#
# Hence, instead of using azurerm provider the following resources are 
# created using AzAPI provider to make directy API calls to Azure.


resource "azapi_resource" "managed_certificate" {
  depends_on = [azapi_update_resource.custom_domain, time_sleep.cname_and_txt_propagated]
  type       = "Microsoft.App/managedEnvironments/managedCertificates@2023-05-01"
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



resource "azapi_update_resource" "custom_domain_binding_create" {
  type        = "Microsoft.App/containerApps@2023-05-01"
  resource_id = azurerm_container_app.acaapp.id


  body = {
    properties = {
      configuration = {
        ingress = {
          customDomains = [
            {
              bindingType   = "SniEnabled",
              name          = var.api_domain_name,
              certificateId = azapi_resource.managed_certificate.output.id
            }
          ]
        }
      }
    }
  }
}

resource "azapi_resource_action" "custom_domain_binding_destroy" {
  type = "Microsoft.App/containerApps@2023-05-01"

  # following line also makes this resource a dependent 
  # on the custom_domain_binding_create resource
  resource_id = azapi_update_resource.custom_domain_binding_create.resource_id

  # It seems `action` just gets appended to the URL obtained by
  # appending `resource_id` to the base url for the `type`
  # this gives us URLs for actions on some resources like 
  # `/start` on a Web App in an App Service Plan.
  # WE DON't WANT TO USE THIS HERE"
  #
  #action                 = ""


  # default for this resource is POST
  # unlike for the azapi_update_resource
  # resource for which it seems to be PATCH
  # from my Fiddler investigations
  method = "PATCH"

  response_export_values = ["*"]

  body = {
    properties = {
      configuration = {
        ingress = {
          customDomains = []
        }
      }
    }
  }

  # The all-important `when` argument, that makes this resource 
  # act like a destroy provisioner counterpart to the 
  # azapi_resource_action.custom_domain_binding_destroy resource's
  # create provisioner behaviour for the ACA app resource
  # (azapi_update_resource resource only runs on create whereas
  # the present resoruce can run on either create or destroy; we
  # are running it on destroy).
  when = "destroy"
}

# TODO: Upadate this comment

# we want requests to the app proxied through CloudFlare
# This is why we added all the ip_restriction blocks 
# to the ingress to allow trafix only from CloudFlare's
# set of stable IPs
#
# HOWEVER, if we do this now, during creation of the 
# managed certificate, CNAME verification will fail:
#  RESPONSE 400: 400 Bad Request
#│ ERROR CODE: FailedCnameValidation
#
# This also happens when you try to add a custom
# domain to the app (for which the managed certificate
# is probably created just in time by the UI) 
#
# Therefore we set it to false. Moreover
# this is not being ignored in lifecycle block
# so any subsequent changes to the underlying record
# would ensure it stays false.
# HOWEVER, I am going to use a provisioner to 
# set it to true WHENEVER this resource changes,
# i.e. is created or updated,
# AND once the managed certificate and custom DNS
# for the app have been created or updated if 
# necessary.

resource "restful_operation" "turn_on_proxied_in_cname_record" {
  depends_on = [azapi_update_resource.custom_domain_binding_create, azapi_resource.managed_certificate]

  lifecycle {
    replace_triggered_by = [cloudflare_dns_record.acaapp_cname, cloudflare_dns_record.acaapp_txt]
  }

  provider = restful.cloudflare

  path   = "/zones/${cloudflare_dns_record.acaapp_cname.zone_id}/dns_records/${cloudflare_dns_record.acaapp_cname.id}"
  method = "PATCH"
  body   = { "proxied" : true }

  # I think we can also poll for retry. See resource
  # documenation in terraform registry (under
  # magodo/restful provider)
}
