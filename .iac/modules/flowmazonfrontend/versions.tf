terraform {
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "4.1.0"
    }
    github = {
      # Requires GITHUB_TOKEN environment variable to be set
      # This should have read-write permissions on "Environments"
      #in the repo in whose specified Environment a variable
      # or secret is to be set
      source  = "integrations/github"
      version = "6.6.0" # version pinned for repeatability
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.6.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }

    vercel = {
      source  = "vercel/vercel"
      version = "3.7.0" # version pinned for repeatability
    }
  }
}
