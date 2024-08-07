import React from 'react';
import Head from 'next/head';

import ConnectionPhysiologyView from '@/views/reconstruction-data/ConnectionPhysiology';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Connection Physiology / Reconstruction data / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <ConnectionPhysiologyView />
    </>
  );
};
