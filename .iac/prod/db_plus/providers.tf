

terraform {

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

    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }

    neon = {
      source  = "kislerdm/neon"
      version = "0.9.0" # Pinned for repeatability
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

  features {
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
    resource_group {
      prevent_deletion_if_contains_resources = false
    }

  }
}

provider "neon" {
  # API key is provided via env variable NEON_API_KEY
}
