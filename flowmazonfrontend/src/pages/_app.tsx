import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import otelConfig from '@/config/otelconfig';
import config from '@/config/config';

if (typeof window !== 'undefined') {
  initializeFaro({
    url: otelConfig.faroUrl,
    app: {
      name: otelConfig.resource.clientSideServiceName.value,
      version: otelConfig.resource.version.value,
      environment: otelConfig.resource.environment.value,
    },
    instrumentations: [
      // Mandatory, omits default instrumentations otherwise.
      ...getWebInstrumentations(),
      // Tracing package to get end-to-end visibility for HTTP requests.
      new TracingInstrumentation({
        instrumentationOptions: {
          // Requests to these URLs have tracing headers attached.
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
