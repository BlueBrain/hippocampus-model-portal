import React from 'react';
import Head from 'next/head';

import NeuronModelsView from '@/views/reconstruction-data/NeuronModels';


export default function NeuronModelsPage() {
  return (
    <>
      <Head>
        <title>Neuron models / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <NeuronModelsView />
    </>
  );
};
