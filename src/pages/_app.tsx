import React from 'react';
import Head from 'next/head';
import { createNexusClient } from '@bbp/nexus-sdk';
import { NexusProvider } from '@bbp/react-nexus';
import smoothscroll from 'smoothscroll-polyfill';

import { nexus } from '../config';
import MainLayout from '../layouts/MainLayout';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Feedback from '../components/Feedback';

import '../styles/globals.scss'


if (typeof window === 'undefined') {
  require('abort-controller/polyfill');
} else {
  smoothscroll.polyfill();
  require('systemjs');
  require('systemjs/dist/extras/amd');
}

const nexusClient = createNexusClient({
  uri: nexus.url,
  token: nexus.token,
});


function App({ Component, pageProps }) {
  return (
    <NexusProvider nexusClient={nexusClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;700&display=swap" />
        <link rel="shortcut icon" href="https://www.hippocampushub.eu/favicon.ico" />
      </Head>

      <GoogleAnalytics />
      <Feedback />

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NexusProvider>
  )
}


export default App
