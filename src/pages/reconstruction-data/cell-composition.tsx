import React from 'react';
import Head from 'next/head';

import CellCompositionView from '@/views/reconstruction-data/CellComposition';


export default function CellCompositionPage() {
  return (
    <>
      <Head>
        <title>Cell composition / Reconstruction data / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <CellCompositionView />
    </>
  );
};
