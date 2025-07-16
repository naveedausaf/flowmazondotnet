import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import otelConfig from '@/config/otelconfig';
import config from '@/config/config';

// Initialize Faro SDK which will send telemetry from
// client-side part of the app (that runs in the browser).

// Code adapted from:
// https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/quickstart/nextjs/
//
// and
// https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/opentelemetry-js/

// Despite this being a client component (see `use client`
// at the top of this file), it still renders at least
// once on the server where `window` object would be undefined.
// It will also run on the client when we do want to initialize
// Faro.
// Hence the following guard condition:
if (typeof window !== 'undefined') {
  initializeFaro({
    url: otelConfig.faroUrl,
    app: {
      name: otelConfig.resource.clientSideServiceName.value,
      namespace: otelConfig.resource.namespace.value,
      version: otelConfig.resource.version.value,
      environment: otelConfig.resource.environment.value,
    },
    instrumentations: [
      // Mandatory, omits default instrumentations otherwise.
      ...getWebInstrumentations(),
      // Tracing package to get end-to-end visibility for HTTP requests.
      new TracingInstrumentation({
        instrumentationOptions: {
          // Requests to these URLs have Otel tracing headers attached.
          //Without the wildcard (/*) at the end of domain name,
          //Otel tracing context does not propagate to the
          //API service.
          propagateTraceHeaderCorsUrls: [
            new RegExp(`${config.serviceUrls.base}/*`),
          ],
        },
      }),
    ],
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flowmazon</title>
        <meta name='description' content='We make your wallet cry.' />
      </Head>
      <main className='m-auto max-w-7xl min-w-[300px] p-4'>
        <Component {...pageProps} />
      </main>
    </>
  );
}
