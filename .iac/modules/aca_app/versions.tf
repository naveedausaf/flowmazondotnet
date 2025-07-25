terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.34.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.6.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "2.4.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "0.13.1"
    }
    restful = {
      source                = "magodo/restful"
      version               = "0.22.0"
      configuration_aliases = [restful.cloudflare]
    }
  }
}
