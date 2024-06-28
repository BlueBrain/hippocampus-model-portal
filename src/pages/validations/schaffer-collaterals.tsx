import React from 'react';
import Head from 'next/head';

import SchafferCollateralsView from '@/views/validations/SchafferCollaterals';


export default function SchafferCollateralsPage() {
  return (
    <>
      <Head>
        <title>Schaffer collaterals / Validations / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SchafferCollateralsView />
    </>
  );
};
