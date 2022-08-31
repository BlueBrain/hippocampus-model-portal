import React from 'react';
import Head from 'next/head';

import ConnectionsView from '@/views/reconstruction-data/Connections';


export default function ConnectionsPage() {
  return (
    <>
      <Head>
        <title>Connections / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <ConnectionsView />
    </>
  );
};
