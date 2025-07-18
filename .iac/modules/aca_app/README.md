This Terraform module does the following:

- creates a new resource group for housing the Azure Container App environment and app.
- creates a new Azure Container Apps environment in the newly created resoruce group
- creates a new Azure Container Apps app in the newly created environment, with the following configuartion:
  - Has an HTTP Ingress that:
    - allows trafic only through port `var.app_container_port`
    - only over TLS secured with a managed certificate issued by the created Azure Container Apps environment
    - only from [IP addresses that CloudFlare uses to proxy traffic](https://developers.cloudflare.com/fundamentals/concepts/cloudflare-ip-addresses/#allow-cloudflare-ip-addresses) to proxied servers.
    - accepts a TLS certificate provided by the caller but doesn't require it.
      I do not set `client_certificate_mode` on the app to `required` because merely requiring a client certificate does not enable mTLS (see note below).
  - runs a container from image located in Azure Container Registry with name `var.image_login_server`.

    The image itself has repository `var.image_repository` and tag `var.image_tag`.

    Liveness, Health and Readiness probes are as specified by corresponding input variables.

  - The container is passed environment variable named `ALLOWED_CORS_ORIGINS` and a secret named `ConnectionStrings__FlowmazonDB` from vault named `var.vault_name`

- creates a CNAME and TXT record in the CloudFlare Zone identified by `var.cloudflare_zone_id` which proxies requests through cloudflare to the FQDN of the ACA app.

- Puts in place a rate limiting rule on the zone (per-hostname rate limiting not possible on CloudFlare free plan)

## Usage Notes

### Assumptions

- This module assumes that a cloudflare zone already exists for the apex domain, a subdomain of which is going to be mapped to the ACA app via a CNAME record. The Zone ID of this zone is what is provided as value of input variable `cloudflare_zone_id`.

### Rate Limiting Rule

- On paid plans, you can create multiple reate limiting rules and different rate limiting rules for different hostnames in the zone.

  However, on the free plan, you can have just **one Rate Limiting Rule per zone** and this may only be created at the zone level.

  **To be able to work with the CloudFlare Free plan, this module creates a zone-level rate limiting rule. BEWARE THAT:**
  - the rule would apply to all CNAME and A records in the zone that are proxied through cloudflare.
  - On `terraform delete` the rule would be deleted. This may be problem if you have other DNS records on the zone that are proxied through Cloudflare for they would lose the protection of that rule also.

- A slight complication with a zone-level rate limiting rule (at least on the free plan), is that it may already exist even if you can't see it in the Cloudflare Dashboard (perhaps you created it in the CloudFlare UI and later deleted it?). If such a rule does exist and you can't see it in the UI, all that creating a new rule in the UI would do is enable the existing rule.

  So in Terraform code I assume the rule if it exists is called `"default"`. I got this name by executing the following cURL, which returned all ruleset.
  From this I picked out the "name" of the ruleset for
  `phase = "http_ratelimit"` and used this name in Terraform to create/update the rate limiting rule

  ```bash
  curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets" \
   -H "Authorization: Bearer {api_token}" \
   -H "Content-Type: application/json"
  ```

  **If you're on the free plan and get an error creating the rate limiting rule when running the module,** check if there is an existing rate limiting rule with `phase = "http_ratelimit"`and what its name is. If different from `"default"`, supply that name as value of input variable `cloudflare_rate_limiting_rule_name`.

  **Note that the name of the rule returned by cURL above may be different from how it appears in the UI** (if the rule already exists). **We want the rule name as it is reported by the above cURL**.

## Enabling mTLS (mutual Transport Layer Security) between CloudFlare and your ACA app

**This module does not currently set up mTLS**. However, this section presents a sketch of how you could enable mTLS between CloudFlare and your app.

Even though the module logic restricts traffic to the app from IP Addresses that CloudFlare uses when proxying to your app, using mutual Transport Layer Security (described [here](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/explanation/)) would enhance the guarantee that the traffic to your app really is coming from the subdomain that you mapped to it via the CNAME record your created in your CloudFlare zone and not from a malicious actor (e.g. one who leveraged [IP address spoofing](https://www.kaspersky.com/resource-center/threats/ip-spoofing)).

Here is how you could enable mTLS between CloudFlare and your app:

- enable **Authenticated Origin Pulls** on CloudFlare. This means CloudFlare will present a certificate when proxying a call to your app. This may be done in one of two ways:
  - Enable **Authenticated Origin Pulls** on the zone level. This means that CloudFlare will present a generic certificate when calling your app that only identifies that the request is genuinely coming from CloudFlare proxy network. You can download this certificate [from here](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/zone-level/) in order to validate the presented certificate against it on future calls to the app.
    This may be done as follows using Terraform:

    ```
    resource "cloudflare_zone_setting" "app_apex_domain" {
        zone_id    = var.cloudflare_zone_id
        setting_id = "tls_client_auth"
        value      = "on"
    }
    ```

  - Enable **Authenticate Origin Pulls** on the hostname level. Here you would need to create and upload your own certificate that CloudFlare would then present whenever it calls in to yout app. The upside is that you have enhanced assurance the request in to your app is coming from the domin name/hostname in your CNAME record.

- The second thing you ned to do is to authenticate the presented certificate when a call is received in to your app. This may be done in several ways. Two possibilities are as follows:
  - Store the expected client certificate with a sevice like Azure Gateway which would check it on every call to your app that it intercepts.
  - Set the `clientCertificateMode` of the Ingress on the ACA app to `require` (in Terraform this means setting `ingress.client_certificate_mode` on the app to `"require"`) as described [here](https://learn.microsoft.com/en-us/azure/container-apps/mtls) and [here](https://learn.microsoft.com/en-us/azure/container-apps/client-certificate-authorization#example-x-forwarded-client-cert-header-value), then verify the received certificate in application code which in an ASP.NET Core app can be done using the Authentication middleware [as described here](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/certauth?view=aspnetcore-9.0).
