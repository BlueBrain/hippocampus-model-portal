import React from 'react';
import Head from 'next/head';
import { createNexusClient } from '@bbp/nexus-sdk';
import { NexusProvider } from '@bbp/react-nexus';

import { nexus } from '../config';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Feedback from '../components/Feedback';
import { init as initSentry } from '../services/sentry';

import '../styles/globals.scss'


require('abort-controller/polyfill');

initSentry();

const nexusClient = createNexusClient({
  uri: nexus.url,
  token: nexus.token,
});


function App({ Component, pageProps }) {
  return (
    <NexusProvider nexusClient={nexusClient}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;700&display=swap" />
        <link rel="shortcut icon" href="https://www.hippocampushub.eu/favicon.ico" />

        <script src="https://www.unpkg.com/systemjs@6.1.7/dist/system.js" />
        <script src="https://www.unpkg.com/systemjs@6.1.7/dist/extras/named-exports.js" />
        <script type="systemjs-importmap" src="/model/systemjs-importmap.json" />
      </Head>

      <GoogleAnalytics />
      <Feedback />

      <Component {...pageProps} />
    </NexusProvider>
  )
}


export default App
