import React from 'react';
import { createNexusClient } from '@bbp/nexus-sdk';
import { NexusProvider } from '@bbp/react-nexus';
import smoothscroll from 'smoothscroll-polyfill';

import { nexus } from '../config';
import MainLayout from '../layouts/MainLayout';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Feedback from '../components/Feedback';

import '../styles/globals.scss';


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
      <GoogleAnalytics />
      <Feedback />

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NexusProvider>
  )
}


export default App
