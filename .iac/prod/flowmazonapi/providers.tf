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
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}
