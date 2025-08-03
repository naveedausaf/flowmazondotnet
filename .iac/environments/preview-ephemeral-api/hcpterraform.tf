terraform {
  cloud {

    organization = "Flowmazon"

    # Since we will be dynamically creating a workspace
    # for the configuartion in this folder, we will be 
    # passing the name of this workspace 
    # (of form `preview-ephemeral-pr<GitHub PR number>`)
    # when executing the configuration in this folder
    # by setting environment variable TF_WORKSPACE.
    # 
    # Therefore we have commented out the nested 
    # `workspaces` block, as described at this link:
    # https://developer.hashicorp.com/terraform/language/terraform#tf_workspace

    # workspaces {
    #   name = "preview-ephemeral-api"
    # }
  }
}
