

variable "neon_org_id" {
  description = "The name for the Neon project."
  type        = string
  default     = "org-sweet-cherry-48410063"
}
variable "neon_project_name" {
  description = "The name for the Neon project."
  type        = string
  default     = "flowmazonprod"
}

variable "neon_branch_name" {
  description = "The name for the Neon branch (e.g., 'main' or 'prod')."
  type        = string
  default     = "main"
}

variable "neon_database_name" {
  description = "The name of the database to be created in Neon (e.g., 'flowmazondb')."
  type        = string
  default     = "flowmazondb"
}

# for the following role names,
# bear in mind that in NeonDB roles and users
# are synonymous
variable "neon_app_role" {
  description = "The name for the Neon database role that the application will use."
  type        = string
  sensitive   = true
  default     = "flowmazon_app_user"
}

variable "neon_owner_role" {
  description = "The name for the Neon database owner role."
  type        = string
  sensitive   = true
  default     = "flowmazow_db_owner"

}


