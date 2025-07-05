variable "vercel_team_id" {
  description = "Team ID displayed on you Setting page of a Team in your Vercel account. We need this to create a project, and the project would be created in in the team with the given Team ID."
  type        = string
  sensitive   = true
}

variable "vercel_project_name" {
  description = "Name of the project that would be created."
  type        = string

}

variable "vercel_app_domain_name" {
  description = "Desired domain name for the Vercel project. This will be mapped to the project's own domain name in vercel through a CNAME record with external DNS provider like Cloudflare."
  type        = string
}

variable "cloudflare_api_token" {
  description = "CloudFlare's API Token with permissions to `Zone | DNS Zone | DNS | Edit` permission on the Zone for the apex domain whose subdomain is going to be mapped to Vercel project's domain name via a CNAME record."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name specified in api_domain_name variable."
  type        = string
  sensitive   = true
}
