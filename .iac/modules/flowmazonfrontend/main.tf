# IN VERCEL FREE PLAN THERE ARE TWO FIXED ENVIRONMENTS 
# IN A PROJECT: Production and Preview.
# This doesn't matter as I would use a separate Vercel 
# project for each of my environments Production, Staging
# and Preview.

resource "vercel_project" "app" {
  name                       = var.vercel_project_name
  framework                  = "nextjs"
  serverless_function_region = var.vercel_region_for_server_side_execution

  # The following page is a MUST-READ for setting and
  # using environment variables in a Vercel project:
  # https://vercel.com/docs/environment-variables

  # Salient details of environments variables in a project:
  #
  # 1. You have to choose which Environments in the project
  #   they apply to.
  # 2. Any changes you make to these only apply to future 
  #   deployments and not current ones.
  # 3. If you mark a variable as sensitive, its value cannot
  #   be read (by a human user) after being set:
  #   https://vercel.com/docs/environment-variables/sensitive-environment-variables

  environment = [
    {
      key    = "NEXT_PUBLIC_OTEL_ENVIRONMENT"
      value  = var.env_NEXT_PUBLIC_OTEL_ENVIRONMENT
      target = ["production", "preview"]
    },
    {
      key    = "OTEL_EXPORTER_OTLP_ENDPOINT"
      value  = var.env_OTEL_EXPORTER_OTLP_ENDPOINT
      target = ["production", "preview"]
    },
    {
      key    = "OTEL_EXPORTER_OTLP_PROTOCOL"
      value  = var.env_OTEL_EXPORTER_OTLP_PROTOCOL
      target = ["production", "preview"]
    },
    {
      key       = "OTEL_EXPORTER_OTLP_HEADERS"
      value     = var.env_OTEL_EXPORTER_OTLP_HEADERS
      target    = ["production", "preview"]
      sensitive = true
    }
  ]







  #   git_repository = {
  #     type = "github"
  #     repo = "<username>/nextjs-terraform-demo"
  #   }
}

resource "github_actions_environment_secret" "vercel_project_id" {
  repository      = var.repository_for_vercel_project_id
  environment     = var.environmentname_for_vercel_project_id
  secret_name     = var.secretname_for_vercel_project_id
  plaintext_value = vercel_project.app.id
}

resource "random_uuid" "vercel_internal_domain_prefix" {
}

locals {
  vercel_internal_domain_name = "${random_uuid.vercel_internal_domain_prefix.result}.vercel.app"
}

# Create the domain name with a UUID subdomain to which
# CNAME record in Cloudflare from provided custom domain
# (in variable vercel_app_domain_name) would map
resource "vercel_project_domain" "internal_app_domain" {

  project_id = vercel_project.app.id
  domain     = local.vercel_internal_domain_name

}

# You also have to create a domain name resource
# with value of vercel_app_domain_name even though 
# vercel_app_domain_name would be resolved by CloudFlare's
# DNS servers (via a CNAME record). 
# Otherwise, if yo uonly create the CNAME at Cloudflare,
# you would get a 404 Not Found with message
# "Code: DEPLOYMENT_NOT_FOUND"
# when you navigate to vercel_app_domaon_name in the browser.
resource "vercel_project_domain" "custom_app_domain" {

  project_id = vercel_project.app.id
  domain     = var.vercel_app_domain_name

}

resource "cloudflare_dns_record" "nextjs_app_cname" {

  zone_id = var.cloudflare_zone_id
  name    = var.vercel_app_domain_name

  # this should be the target FQDN without the `https://` prefix,
  # which is how ingress's fqdn property returns it
  content = local.vercel_internal_domain_name
  type    = "CNAME"
  ttl     = 1 # 1 means TTL is automatically set by CloudFlare

  # Vercel has its [own DDoS protection](https://vercel.com/docs/vercel-firewall/ddos-mitigation)
  # on all deployments. 
  # Also, since I am on Vercel's free account anyway, I am happy
  # not to be proxied through CloudFlare as even if there
  # are too many requests to Vercel app, they won't/can't
  # charge me for them. 
  # This would also preserve any free trafic quotas I 
  # might have with CloudFlare on their free tier.
  proxied = false
}






