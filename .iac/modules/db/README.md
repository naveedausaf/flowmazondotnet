This Terraform module does the following:

- creates a NeonDB project with a single branch, which is the default branch with the specified name
- creates a an owner role with the specified name on the default branch.
- creates an app role with the specified name on the default branch. This would be used by a client app to perform CRUD operations on the databases.
- creates a database with the specified name on the default branch in the project. Its owner is set as the owner role created for the default branch of the project.
- assigns minimal permissions to the app role on the database (bear in mind the database itself is on the default branch of the project) so that it can perform the operations that the client app needs to perform, e.g. it can perform CRUD on tables and use sequences but not perform DDL operations or perform admin tasks.
- Stores connection string needed by a .NET Core app to connect to the database using the app role and using EF Core ProstgrSQL provider, in a secret of the specified name within a key vault of the specified name.
- Assigns read permission on the secret to a User Assigned Managed Identity with the specified name. This is the role that a client app would use to read the secret from Azure Key Vault.
- Stores a connection string with the created owner role's credentials as an environment secret in the specified Environment of the specified GitHub repository. This can be used by GitHub Actions pipelines in that repository to connect to the database from psql (e.g. to run migrations).
