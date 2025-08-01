This Terraform module does the following:

- creates a branch with the specified name off of the specified (source) branch of the specified NeonDB project.
- creates a an owner role with the specified name on new branch it creates. This is set as the owner of the database on the new branch.
- creates an app role with the specified name on the new branch it creates. This would be used by the client app to perform CRUD operations on the databases.
- assigns minimal permissions to the app role on the database (bear in mind the database itself is on the default branch of the project) so that it can perform the operations that the client app needs to perform, e.g. it can perform CRUD on tables and use sequences but not perform DDL operations or perform admin tasks.
- Stores connection string needed by a .NET Core app to connect to the database using the app role and using EF Core ProstgrSQL provider, in a secret of the specified name within a key vault of the specified name.
- Assigns read permission on the secret to a User Assigned Managed Identity with the specified name. This is the role that a client app would use to read the secret from Azure Key Vault.
- Outputs a connection string with the created owner role's credentials to an output variable named `owner_connectionstring_for_psql` that can be used to connect to the database from psql (e.g. to run migrations).
