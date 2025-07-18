This Terraform module does the following:

- Creates a Vercel project for Next.js with the specified name.
- Assigns a `*.vercel.app` domain name to the project with a randomly generated subdomain.
- Create an unproxied CNAME record for the project with the specified domain name which points to the project's Vercel domain name.
