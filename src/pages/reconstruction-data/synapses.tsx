import React from 'react';
import Head from 'next/head';

import SynapsesView from '@/views/reconstruction-data/Synapses';


export default function SynapsesPage(){
  return (
    <>
      <Head>
        <title>Synapses / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SynapsesView />
    </>
  );
};
