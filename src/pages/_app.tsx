import React from 'react';
import Head from 'next/head';
import { createNexusClient } from '@bbp/nexus-sdk';
import { NexusProvider } from '@bbp/react-nexus';

import { nexus } from '../config';

import '../styles/globals.scss'


if (typeof(window)) {
  require('abort-controller/polyfill');
}


const nexusClient = createNexusClient({
  uri: nexus.url,
  token: nexus.token,
});


function MyApp({ Component, pageProps }) {
  return (
    <NexusProvider nexusClient={nexusClient}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;700&display=swap" />
        <link rel="icon" type= "image/x-icon" href="https://hippocampushub.eu/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </NexusProvider>
  )
}


export default MyApp
