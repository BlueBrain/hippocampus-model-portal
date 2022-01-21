import React from 'react';
import Head from 'next/head';

import SynapticPathwaysView from '../../views/digital-reconstructions/SynapticPathways';


export default function DigRecSynapticPathwaysPage() {
  return (
    <>
      <Head>
        <title>Synaptic Pathways / Digital reconstructions / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SynapticPathwaysView />
    </>
  );
};
