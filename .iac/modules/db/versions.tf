# While providers are decalared and initialized
# in the root module, hwere we must declare versions
# of the providers this module needs, otherwise,
# for the ones taht are not hashicorp/*, we get
# an error during terraform plan
terraform {
  required_providers {
    github = {
      # Requires GITHUB_TOKEN environment variable to be set
      # This should have read-write permissions on "Environments"
      #in the repo in whose specified Environment a variable
      # or secret is to be set
      source  = "integrations/github"
      version = "6.6.0" # version pinned for repeatability
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.34.0"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "0.9.0"
    }
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "1.25.0"
    }

  }
}

