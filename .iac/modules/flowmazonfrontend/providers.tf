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

    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.6.0" # pinned to exact version for repeatability
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

  # TODO: Document this in environment documentation:

  # To use this provider:
  #
  # 1. Log in to Vercel and click your avatar in top right hand side 
  # of the page. Select "Account Settings". Then click "Tokens"
  # in men on the left hand side. There, create a Token.
  # Provide value of the generated token in an envirnment variable named 
  # VERCEL_API_TOKEN when running this Terraform configuartion.
  #
  # 2. Copy your team id from the Settings page of a Team in your
  # account and provide it as value of Terraform variable named
  # `vercel_team_id` (again, yo ucan provide it as environment variable
  # named TF_VAR_vercel_team_id).

  team = var.vercel_team_id

}

provider "random" {
  # Configuration options
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
