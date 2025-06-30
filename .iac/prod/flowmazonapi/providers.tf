terraform {
  cloud {

    organization = "EnableHub"

    workspaces {
      name = "flowmazonapi"
    }
  }
  required_providers {
    azurerm = {
      # the service principal (or OIDC principal) that this uses 
      # should have the following permissions for manual execution.
      # Taken from:
      # https://learn.microsoft.com/en-us/azure/role-based-access-control/resource-provider-operations
      #
      # 1. For creating and deleting resource groups:
      #
      # Microsoft.Resources/subscriptions/resourceGroups/write
      # Microsoft.Resources/subscriptions/resourceGroups/delete
      #
      # 2. For creating, deleting, updating and writing keys 
      # into a Key Vault:
      # 
      # Microsoft.KeyVault/vaults/write
      # Microsoft.KeyVault/vaults/delete
      # Microsoft.KeyVault/vaults/secrets/write
      #
      source  = "hashicorp/azurerm"
      version = "4.34.0" # Pinned to an exact version for repeatabilityneeded
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.6.0" # pinned to exact version for repeatability
    }
    azapi = {
      source  = "azure/azapi"
      version = "2.4.0" # pinned to exact version for repeatability
    }
    time = {
      source  = "hashicorp/time"
      version = "0.13.1" # pinned version for repeatability
    }

  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

provider "azapi" {
  # this needs to the same four environment 
  # variables to be provided that we are setting
  # for the azurerm provider above

}



provider "cloudflare" {
  # CLOUDFLARE_API_TOKEN env var must be provided
  # This would contain the API TOKEN (which is the 
  # preferred way of authenticating with CloudFlare
  #over the legacy API KEY)
}

provider "time" {

}
