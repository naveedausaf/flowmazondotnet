# ENABLE RATE LIMITING ON THE ZONE
#######################################################################

# I created this resource by first creating the rule in the UI. That
# displayed an API Call at the bottom of the page. I took it and tweaked
# it to be properties of this cloudflare_ruleset resource

# It still didn't work because a previously deleted rate limiting
# rule, named "default" still existed. All that creating or
# deleting a rate limiting rule for the zone in Cloudflare Dashboard
# was doing was turning it on or off.

# So I ran the following cURL to see the existing ruleset 
# with phase = "http_ratelimit":

# curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets" \
#  -H "Authorization: Bearer {api_token}" \
#  -H "Content-Type: application/json"

# I delete this via a curl -X DELETE call. The whole process
# is documented in the README of this module. From then on, this
# module runs fine on every apply and destroy.

resource "cloudflare_ruleset" "zone_rate_limit" {
  count = var.rate_limit_requests_per_period != null ? 1 : 0

  zone_id = var.cloudflare_zone_id
  name    = var.cloudflare_rate_limiting_rule_name

  # the only kind allowed in free plan
  kind  = "zone"
  phase = "http_ratelimit"

  rules = [{
    # We need to set this. 
    # But I have verified that it still deltes the rate limiting
    # rule in the Cloudflare Dashboard on terraform destroy
    # (although as described in the comment above, deletion in UI
    #  just means disablement of the rule named "default")
    enabled = true

    # Dashboard UI generated this expressions. It means
    # reqeusts to any path in the zone are counted
    # towards the rate limiting threshold
    expression = "(http.request.uri.path wildcard \"/*\")"
    action     = "block"
    ratelimit = {
      characteristics = [
        # This just has to be there, don't know why, otherwise
        # we get an error on terraform apply
        "cf.colo.id",

        # I believe that this means that number of requests
        # will be evaluated for the same source IP, i.e.
        # if the same IP sends a number of requests specified
        # by `requests_per_period` argument below, then that
        # ip would be blocked.
        # In free account, this is one of the few options available.
        "ip.src"
      ]
      # Defines if ratelimit counting is only done when an origin 
      # is reached. I am taking setting it to false to mean that
      # request reaching cloudflare but that were not proxied
      # would still count towards the rate limit.
      requests_to_origin = false

      # This is the number of requests in perion specified by `period`
      # property that, if received, would trigger block on subsequent
      # requests for a period specified by `mitigation_timeout` property.
      requests_per_period = var.rate_limit_requests_per_period

      # Over how many seconds should the specified number of requests
      # (specified in requests_per_period above) should be received
      # or exceeded for the block to be put in place.
      # 10 is the only allowable value in free plan
      period = 10

      # How many seconds the block will stay in place for
      # 10 is the only allowable value in free plan
      mitigation_timeout = 10
    }
  }]
}
