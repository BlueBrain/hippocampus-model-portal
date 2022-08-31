import React from 'react';
import Head from 'next/head';

import MorphologyLibraryView from '@/views/reconstruction-data/MorphologyLibrary';


export default function MorphologyLibraryPage() {
  return (
    <>
      <Head>
        <title>Morphology library / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <MorphologyLibraryView />
    </>
  );
};
