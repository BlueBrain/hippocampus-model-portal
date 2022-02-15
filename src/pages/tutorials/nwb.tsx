import React from 'react';
import Head from 'next/head';

import NwbTutorialView from '../../views/tutorials/Nwb';


export default function Glossary() {
  return (
    <>
      <Head>
        <title>Tutorials - How to read NWB files / Hippocampus Hub Explore</title>
        <meta
          name="description"
          content="How to read NWB files tutorial."
        />
      </Head>

      <NwbTutorialView />
    </>
  );
}
