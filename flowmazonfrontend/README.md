This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Configuration

### Sources of Configuration Data

**When you run the app locally using `npm run dev`,** configuration settings (key value pairs) during local development is provided in `.env.local` in app folder. These are probably automatically set as environment variables during startup when the app is started using `next dev` (which is what `npm run dev` is defined as).

**In all other settings, as far as I know,** configuartion key/value pairs should be set as environment variables even thoug hit is possible to provide them in an `.env` file.

For actual sources of configuration data in a particular (local or non-local) environment of this app, see environment definition in project wiki.

### Required Configuration Keys

- `NEXT_PUBLIC_BACKEND_URL` is the URL of the backend API, without a slash (`/`) at the end.
  Example: `http://localhost:5022`.

### Observability Configuration

**For Observability,** the following keys should be provided otherwise no telemetry would be received in the observability backend (some local environments do not generate telemetry and so may not provides values for these; see relevant evironment's definition for details):

- `NEXT_PUBLIC_FARO_URL`: URL of the Grafana Faro collector to which telemetry would be sent by the client-side part of the app that runs in the browse. This is displayed in Grafana Cloud when you create a Frontend Observability instance.
- `NEXT_PUBLIC_FARO_SERVICE_NAME`: Name specified when creating a Frontend Observability instance in Grafana Cloud. This will be reported by client-side part of the app that runs in the browser when sending telemetry.
- `NEXT_PUBLIC_OTEL_ENVIRONMENT`: An identifier for the environment in which the app is running e.g. `production`, `staging` or the local environment `local_testing`. For details, see Environments in wiki.
  This will be reported by both the client- and server-side code in the app when sending telemetry. Client side browser code reports it as environment to the Faro collector whereas the server-side code reports it as `deployment.environment.name` attribute on the Open Telemetry [Resource](https://opentelemetry.io/docs/specs/semconv/resource/deployment-environment/)).
- `OTEL_EXPORTER_OTLP_ENDPOINT`: URL of an OpenTelemetry Protocol (OTLP) ingestion endpoint. Server-side code in the app will use this to write telemetry.
- `OTEL_EXPORTER_OTLP_PROTOCOL`: The transport, e.g. `grpc` or `http/protobuf`, that would be used to write telemetry to the OTLP endpoint by server-side code in the app.
- `OTEL_EXPORTER_OTLP_HEADERS`: Authorization header that would be provided by the server-side code in the app to the observability backend. Grafana Cloud would show this if you press **Details** button on your **Stack**, then generate a new token; base-64 encoded value of this token would be included in the generated Authorization header that would be shown.

### Optional Configuration Keys

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
