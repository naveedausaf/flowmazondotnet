import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      {/* The background color should also be set as value of 'light' background in parameters.backgrounds.options in preview.ts so that components can render on the same background in Storybook */}
      <body className='bg-[#e3e6e6]'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
