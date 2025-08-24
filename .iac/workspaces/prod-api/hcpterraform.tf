terraform {
  cloud {

    organization = "Flowmazon"

    workspaces {
      name = "prod-api"
    }
  }
}
