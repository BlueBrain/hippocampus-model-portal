import React from 'react';
import Head from 'next/head';

import NeuronModelLibraryView from '@/views/reconstruction-data/NeuronModelLibrary';


export default function NeuronModelLibraryPage() {
  return (
    <>
      <Head>
        <title>Neuron model library / Reconstruction data / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <NeuronModelLibraryView />
    </>
  );
};
