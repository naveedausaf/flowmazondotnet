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
  repository      = var.repository_for_secrets_and_variables
  environment     = var.environmentname_for_secrets_and_variables
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

# Get details of existing Grafana cloud stack
# A new Frontend Observability instance will be created
# in this stack.
#
# As I am on grafana cloud free plan, I can only have one 
# GRafana cloud stack, therefore I shall use the existing 
# stack in the account and create a new Frontend Observability
# instance in it. 
data "grafana_cloud_stack" "grafanacloud" {
  # This is the subdomain of the Grafana Cloud stack
  # URL that is shown on the Stack page in Grafana Cloud.
  # For example, if the URL is https://my-stack.grafana.net,  
  # then the slug is "my-stack".
  slug = var.grafanacloud_stack_slug
}

resource "grafana_frontend_o11y_app" "grafanacloud" {
  stack_id        = data.grafana_cloud_stack.grafanacloud.id
  name            = var.grafanacloud_frontend_o11y_instance_name
  allowed_origins = ["https://${var.vercel_app_domain_name}"]

  extra_log_attributes = {
    "terraform" : "true"
  }

  settings = {
    # This setting means I am choosing NOT to
    # combine RUM data that is collected by this 
    # Frontend Observability instance during normal 
    # user browsing with the data that is collected
    # by k6 labs (this may include not just k6 stress
    # tests but probabaly also synthetic monitoring).
    # Therefore the two types of data will be kept
    # and viewed separately.
    "combineLabData" = "0",

    # I want to receive location data so the following
    # is set to 1
    "geolocation.enabled" = "1",

    "geolocation.level" = "4", # 1-4, where 4 is the most detailed (network level, 3 being city level and so on)

    # No deny list for any country with regards to 
    # whether or not to collect geolocation data.
    # HENCE geolocation data will be collected for all
    # countries.
    #
    #"geolocation.country_denylist" = ""
  }
}

# The URL of the frontend observability instance
# needs to be available at the time the Next.js app
# is compiled as it is baked into the browser bundle.
# Since app build would happen at a later time than
# infrastructure creation (which is happenin here; in
# this TF configuration we are creating the Vercel
# project to host the Next.js app), therefore we are
# storing it as a GitHub Actions secret so that it
# can be used in the CI workflow which builds the app.
resource "github_actions_environment_secret" "grafanacloud_frontend_o11y_instance_url" {
  repository      = var.repository_for_secrets_and_variables
  environment     = var.environmentname_for_secrets_and_variables
  secret_name     = var.secretname_for_grafanacloud_frontend_o11y_instance_url
  plaintext_value = grafana_frontend_o11y_app.grafanacloud.collector_endpoint
}
