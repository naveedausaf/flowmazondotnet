This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Configuration

### Sources of Configuration Data

**When you run the app locally using `npm run dev`,** configuration settings (key value pairs) during local development is provided in `.env.local` in app folder. These are probably automatically set as environment variables during startup when the app is started using `next dev` (which is what `npm run dev` is defined as).

**In all other settings, as far as I know,** configuartion key/value pairs should be set as environment variables even thoug hit is possible to provide them in an `.env` file.

For actual sources of configuration data in each environment of this app, see top-level README for the solution.

### Required Configuration Keys

1. `NEXT_PUBLIC_BACKEND_URL` is the URL of the backend API, without a slash (`/`) at the end.
   Example: `http://localhost:5022`.

### Optional Configuration Keys

- No optional configuration keys are set.

- In addition to configuartion keys, one bit of configuartion may be provided as a command line parameter to the next server: the parameter `-p` passed to `next dev` and `next run` that sets the port at which the next web server would listen. **Default for this is 3000**.

### Note

- `NEXT_PUBLIC_` configuration settings must be available/set at build time as their values are emitted into the client-side bundle and used by it when it runs in the browser.

  This is why I set `NEXT_PUBLIC_BACKEND_URL` (See below) using an `ENV` drective in the Dockerfile so that it is already set and available as an environment variable when the image is being built - and before the app starts to be built (using `next build`) - rather than provide it as an environment variable to a running container created from the app's Docker image.

  Since these values are accessed from the browser, if one of these is the url of an API, this API needs to be accessible from the browser. For local deployments the URL specified in `NEXT_PUBLIC_BACKEND_URL` needs to be accessible from the browser and not just internally in Docker Compose network. This is why I map port of the backend service in Docker Compose file to a port on host machine. For cloud deployment this means that the API whose URL is provided in `NEXT_PUBLIC_BACKEND_URL` is exposed to the internet (perhaps via an API Gateway such as Azure API Management).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
