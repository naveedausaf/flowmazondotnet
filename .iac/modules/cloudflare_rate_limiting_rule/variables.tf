# To generate this token, create an Account API token by going
# to your user profile in your CloudFalre account, then clicking
# **API Token** in the nav on the left hand side.
#
# Note an Account API token is preferred to a User API token.
#
# Give the token the following permissions: 
# 1. 'Zone | DNS | Edit` (to create and modify TXT and CNAME records)
# 2. 'Zone | Zone WAF | Edit` (to set rate limiting rule)
# to 'on' which ensures that CloudFlare would present a certificate
# to target of CNAME record when communicating with it; this 
# achieves mTLS.
# 
# Make sure that the zone of interest on which these permissions apply
# is also selected under 'Zone Resources' - or 'All zones from the acount' 
# is selected - when you assign permissions to the token.
#
variable "cloudflare_api_token" {
  description = "CloudFlare's API Token."
  type        = string
  sensitive   = true
}

# I assume you already have a DNS zone with CloudFlare for
# the apex domain used in the domain name of the app. For example
# if the domain name if `api.efast.uk`, the apex domain is
# efast.uk.
#
# Create this zone by transferring setting Cloudflare's nameservers
# as nameservers of the apex domain in control panel of the registrar
# from whom you purchased the apex domain.
# Cloudflare would also guide you through the process.

# Once you have created an zone, i.e. Cloudflare manage
# DNS queries for the apex domain, then go to CloudFlare Dashboard.
# There click the apex domain name, and you would be taken to
# the detail page of the associated zone. ZoneID would be 
# displayed on this page (you may have to scroll down the page).
variable "cloudflare_zone_id" {
  description = "Zone ID of the apex domain for domain name specified in api_domain_name variable."
  type        = string
  sensitive   = true
}

variable "rate_limit_requests_per_period" {
  description = "number of request that, if received in the configured `period` (fixed to 10 seconds in free plan), would lead to the sending IP being blocked for the configured `mitigation_timeout` (also fixed to 10 seconds in free plan)."
  type        = number

}

variable "cloudflare_rate_limiting_rule_name" {
  description = "Name of the rate limiting rule. This has several nuances, including why it is creaed at the Zone level rather than hostname level and why it defaults to value \"default\". See README for details."
  type        = string
  default     = "default"

}
