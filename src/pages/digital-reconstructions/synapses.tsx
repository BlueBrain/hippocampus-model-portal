import React from 'react';
import Head from 'next/head';

import SynapsesView from '../../views/3_digital-reconstructions/Synapses';


export default function DigRecNeuronsPage() {
  return (
    <>
      <Head>
        <title>Synapses / Digital reconstructions / Hippocampus Hub Explore</title>
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
