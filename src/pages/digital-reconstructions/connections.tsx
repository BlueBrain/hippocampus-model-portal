import React from 'react';
import Head from 'next/head';

import ConnectionsView from '@/views/digital-reconstructions/Connections';


export default function DigRecConnectionsPage() {
  return (
    <>
      <Head>
        <title>Connections / Digital reconstructions / Hippocampus Hub Explore</title>
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
