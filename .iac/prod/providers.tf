

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.0.0" # Pinned to an exact version for repeatabilityneeded
    }

    neon = {
      source  = "kislerdm/neon"
      version = "0.6.1" # Pinned for repeatability
    }
    # adding this provider as neon provider
    # only provisions a user in neon_superuser
    # to add other types of users they say to 
    # user SQL:
    # https://neon.com/docs/manage/roles
    postgresql = {
      # Using cyrilgdn/postgresql provider
      source  = "cyrilgdn/postgresql"
      version = "1.25.0" # Pinned to specific version
    }

  }
}

provider "azurerm" {
  features {}
}

provider "neon" {
  # API key is provided via env variable NEON_API_KEY
}
