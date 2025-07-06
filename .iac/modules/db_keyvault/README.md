This module creates the database as well as any Azure infrastructure that would be used by both:

- the API app (which would use Azure resources such as Key Vault and Container Registry created by this module, but there is a separate Terraform module to deploy the API app and/or infrastructure)

- the Next.js frontend app
