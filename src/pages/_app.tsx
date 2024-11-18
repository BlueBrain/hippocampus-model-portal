import React from 'react';
import Head from 'next/head';
import { createNexusClient } from '@bbp/nexus-sdk';
import { NexusProvider } from '@bbp/react-nexus';
import smoothscroll from 'smoothscroll-polyfill';

import { nexus } from '../config';
import MainLayout from '../layouts/MainLayout';

import '../styles/globals.scss';


if (typeof window === 'undefined') {
  require('abort-controller/polyfill');
} else {
  smoothscroll.polyfill();
  require('systemjs/dist/s');
  require('systemjs/dist/extras/amd');
}

const nexusUrl = nexus.url;
const nexusToken = nexus.token;

const nexusClient = createNexusClient({
  uri: nexusUrl,
  token: nexusToken,
});

function App({ Component, pageProps }) {
  return (
    <NexusProvider nexusClient={nexusClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NexusProvider>
  );
}

export default App;
