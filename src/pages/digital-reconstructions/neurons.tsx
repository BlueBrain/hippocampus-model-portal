import React from 'react';
import Head from 'next/head';

import NeuronsView from '../../views/digital-reconstructions/Neurons';


export default function DigRecNeuronsPage() {
  return (
    <>
      <Head>
        <title>Neurons / Digital reconstructions / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <NeuronsView />
    </>
  );
};
