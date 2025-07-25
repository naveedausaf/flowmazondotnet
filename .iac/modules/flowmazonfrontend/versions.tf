terraform {
  required_providers {

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
