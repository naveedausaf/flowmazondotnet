resource "vercel_project" "app" {
  name      = var.vercel_project_name
  framework = "nextjs"
  #   git_repository = {
  #     type = "github"
  #     repo = "<username>/nextjs-terraform-demo"
  #   }
}

output "vercel_project_id" {
  value = vercel_project.app.id

}

resource "random_uuid" "vercel_internal_domain_prefix" {
}

locals {
  vercel_internal_domain_name = "${random_uuid.vercel_internal_domain_prefix.result}.vercel.app"
}

resource "vercel_project_domain" "app" {

  project_id = vercel_project.app.id
  domain     = local.vercel_internal_domain_name

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








