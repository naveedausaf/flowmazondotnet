# Neon DB variables

variable "neon_project_id" {
  description = "project_id of the Neon DB Project in which a new branch would be created by this module. This is also the project that contains the source branch off of which the new branch will be created."
  type        = string
}

variable "neon_source_branch_id" {
  description = "branch_id of the specified Neon DB Project branch from which a new branch would be created by this module."
  type        = string
}

variable "neon_new_branch_name" {
  description = "Name of the new branch that would be created by this module in the specified Neon DB Project."
  type        = string
}
