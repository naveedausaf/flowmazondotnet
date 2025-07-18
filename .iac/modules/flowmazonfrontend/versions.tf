terraform {
  required_providers {
    # azurerm = {
    #   source  = "hashicorp/azurerm"
    #   version = "4.34.0"
    # }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.6.0"
    }

    vercel = {
      source  = "vercel/vercel"
      version = "3.7.0" # version pinned for repeatability
    }
  }
}
