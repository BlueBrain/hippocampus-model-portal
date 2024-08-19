import React from 'react';
import Head from 'next/head';

import VolumeView from '@/views/2_reconstruction-data/Volume';


export default function VolumePage() {
  return (
    <>
      <Head>
        <title>Volume / Reconstruction data / Hippocampus Hub Explore</title>
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
