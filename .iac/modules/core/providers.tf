terraform {

  required_providers {
    azurerm = {
      # TODO: Document permissions also

      # Following environment variables must be provided for this provider:
      # ARM_SUBSCRIPTION_ID, ARM_CLIENT_ID, ARM_TENANT_ID, ARM_CLIENT_SECRET
      #
      # All of these - except ARM_SUBSCRIPTION_ID can be obtained when 
      # you create a service principle in Entra in Azure portal.
      #
      # For ARM_SUBSCRIPTION_ID, provide the ID of a subscription
      # in your Azure account.
      source  = "hashicorp/azurerm"
      version = "4.34.0" # Pinned to an exact version for repeatability
    }

  }
}

provider "azurerm" {
  features {

  }
}
