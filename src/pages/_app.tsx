import React from 'react';
import Head from 'next/head';
import { createNexusClient } from '@bbp/nexus-sdk';
import { NexusProvider } from '@bbp/react-nexus';
import smoothscroll from 'smoothscroll-polyfill';

import { nexus } from '../config';
import MainLayout from '../layouts/MainLayout';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Feedback from '../components/Feedback';

import '../styles/globals.scss';

import { register } from 'instrumentation'; // Use in layout.jsx if using app routing
register();

if (typeof window === 'undefined') {
  require('abort-controller/polyfill');
} else {
  smoothscroll.polyfill();
  require('systemjs/dist/s');
  require('systemjs/dist/extras/amd');
}

const nexusUrl = nexus.url || 'default-url'; // Replace 'default-url' with an actual default value or handle the error
const nexusToken = nexus.token || 'default-token'; // Replace 'default-token' with an actual default value or handle the error

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

      <GoogleAnalytics />
      { /* <Feedback /> */}

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NexusProvider>
  );
}

export default App;