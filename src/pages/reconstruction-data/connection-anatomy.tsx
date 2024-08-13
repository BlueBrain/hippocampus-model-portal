import React from 'react';
import Head from 'next/head';

import ConnectionsView from '@/views/reconstruction-data/ConnectionAnatomy';


export default function ConnectionsPage() {
  return (
    <>
      <Head>
        <title>Connection Anatomy / Reconstruction data / Hippocampus Hub Explore</title>
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
