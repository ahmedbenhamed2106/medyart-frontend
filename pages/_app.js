import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>MedyArt</title>
        <link rel="icon" href="/icon.jpeg" />
        <link rel="shortcut icon" href="/icon.jpeg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
