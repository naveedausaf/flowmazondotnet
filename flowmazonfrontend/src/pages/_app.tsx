import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flowmazon</title>
        <meta name='description' content='We make your wallet cry.' />
      </Head>
      <main className='m-auto min-w-[300px] max-w-7xl p-4'>
        <Component {...pageProps} />
      </main>
    </>
  );
}
