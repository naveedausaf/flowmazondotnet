
terraform {
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "4.1.0"
    }
    github = {
      # Requires GITHUB_TOKEN environment variable to be set
      # This should have read-write permissions on "Environments"
      #in the repo in whose specified Environment a variable
      # or secret is to be set
      source  = "integrations/github"
      version = "6.6.0" # version pinned for repeatability
    }
    azurerm = {
      # Following environment variables must be provided for this provider:
      # ARM_SUBSCRIPTION_ID, ARM_CLIENT_ID, ARM_TENANT_ID, ARM_CLIENT_SECRET
      #
      # All of these - except ARM_SUBSCRIPTION_ID can be obtained when 
      # you create a service principal in Entra in Azure portal.
      #
      # For ARM_SUBSCRIPTION_ID, provide the ID of a subscription
      # in your Azure account.
      source  = "hashicorp/azurerm"
      version = "4.34.0" # Pinned to an exact version for repeatabilityneeded
    }

    neon = {
      source  = "kislerdm/neon"
      version = "0.9.0" # Pinned for repeatability
    }
    # adding this provider as neon provider
    # only provisions a user in neon_superuser role.
    # To add other types of users - which we need to -
    # we need to use this provider
    # https://neon.com/docs/manage/roles
    postgresql = {
      # Using cyrilgdn/postgresql provider
      source  = "cyrilgdn/postgresql"
      version = "1.25.0" # Pinned to specific version
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.6.0" # pinned to exact version for repeatability
    }

    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }

    vercel = {

      source  = "vercel/vercel"
      version = "3.7.0" # version pinned for repeatability
    }

  }
}

provider "grafana" {
  cloud_access_policy_token      = var.grafanacloud_frontend_o11y_api_access_token
  frontend_o11y_api_access_token = var.grafanacloud_frontend_o11y_api_access_token
}


provider "github" {}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {

      # In Production, we configure soft delete and purge-protectioon
      # to enabled on key vaults, as per the best practices:
      # https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices
      #      
      # "Soft-delete" means a deleted key vault would be recoverable
      # (for 90 days by default). This is a protection against
      # accidental deletin:
      # https://learn.microsoft.com/en-us/azure/key-vault/general/soft-delete-overview#soft-delete-behavior
      #
      # Purging means to permanently delete a key vault 
      # that was already deleted but was still recoverable bu virtue of
      # the fact that it had soft-delete enabled on it.
      #
      # When "purge protection" is enabled on a key vault, this would not be 
      # possible, i.e. you would not be able to purge a soft-deleted
      # key vault. It would noly get deleted automatically after the
      # retention period, which defaults t o90 days, has elapsed, or the 
      # vaultis n longer scheduled for permanent deletion because it was
      # recovered befrooe this period elapsed.
      # https://learn.microsoft.com/en-us/azure/key-vault/general/soft-delete-overview#purge-protection
      #
      # If soft-delete is enabled on a key vault, this provider would 
      # first delete it (this would be a soft-delete), and then 
      # purge it in order to effect complete deletion on
      # `terraform destroy`. This is because the default value
      # of the argument below, `purge_soft_delete_on_destroy`, 
      # is `true`.
      #
      # However, with the purge protection
      # enabled on key vaults we create in this configuration,
      # the provider wn't be able to do that when it tries to 
      # destroy an azurerm_key_vault resource. Therefore we
      # set this argument to false.
      purge_soft_delete_on_destroy = false

      # Given that a Production environment key vault
      # would not be permanently deleted (as described
      # above), once it has been (soft-)deleted by 
      # `terraform destroy`, I would like it to be
      # recovered when Terraform tries to create a 
      # vault with the same name in a subsequent
      # `terraform apply`. This is what setting 
      # `recover_soft_deleted_key_vaults` to true
      # achieves,as done below.
      recover_soft_deleted_key_vaults = true


      # By roughly the same reasoning as for the 
      # `purge_soft_delete_on_destroy` property above, 
      # we would enable soft-delete on individual secrets,
      # cryptographic keys and certificates in the vault,
      # and therefore set the following to true.
      purge_soft_deleted_secrets_on_destroy      = false
      purge_soft_deleted_keys_on_destroy         = false
      purge_soft_deleted_certificates_on_destroy = false

    }
  }
}

provider "random" {
  # Configuration options
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

provider "neon" {
  # API key to be provided via env variable NEON_API_KEY
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
