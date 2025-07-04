terraform {
  required_providers {
    azurerm = {
      # Following environment variables must be provided for this provider:
      # ARM_SUBSCRIPTION_ID, ARM_CLIENT_ID, ARM_TENANT_ID, ARM_CLIENT_SECRET
      #
      # All of these - except ARM_SUBSCRIPTION_ID can be obtained when 
      # you create a service principle in Entra in Azure portal.
      #
      # For ARM_SUBSCRIPTION_ID, provide the ID of a subscription
      # in your Azure account.
      source  = "hashicorp/azurerm"
      version = "4.34.0" # Pinned to an exact version for repeatabilityneeded
    }

    vercel = {
      source  = "vercel/vercel"
      version = "3.7.0" # version pinned for repeatability
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

provider "vercel" {
  # Configuration options
}
