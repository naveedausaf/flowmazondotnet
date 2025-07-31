This Terraform module does the following:

- Creates a resource group

- Creates an Azure Key Vault in the resource group.

- Creates a User Assigned Managed Identity in the resource group.

- **If a non-`null` value for input variable `container_registry_id` is provided,** then it assigns image pull permissions to the created identity on the Azure Container Registry whose id is provided in `container_registry_id`.

**A note on the intended usage of the user-assigned managed identity:** This identity created by this module is intended to be used to access specific secrets in the create Key Vault and pull images from an Azure Container registry. While this module does assign image pull permissions to the identity on an Azure Container Registry whose name is supplied, it does not assign any permissions to the identity on the created Azure Keyu Vault. Giving permissions to the identity on specific secrets (granular permissions) is left for other modules to do.
