import React from 'react';
import Head from 'next/head';

import NeuronsView from '../../views/3_digital-reconstructions/Neurons';


export default function DigRecNeuronsPage() {
  return (
    <>
      <Head>
        <title>Neurons / Digital reconstructions / Hippocampus Hub Explore</title>
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
