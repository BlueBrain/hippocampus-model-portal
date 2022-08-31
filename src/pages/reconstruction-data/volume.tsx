import React from 'react';
import Head from 'next/head';

import VolumeView from '@/views/reconstruction-data/Volume';


export default function VolumePage() {
  return (
    <>
      <Head>
        <title>Volume / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <VolumeView />
    </>
  );
};
