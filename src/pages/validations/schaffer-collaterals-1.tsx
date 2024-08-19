import React from 'react';
import Head from 'next/head';

import SchafferCollateralsView from '@/views/4_validations/SchafferCollaterals_1';


export default function SchafferCollateralsPage() {
  return (
    <>
      <Head>
        <title>Schaffer collaterals 1 / Validations / Hippocampus Hub Explore</title>
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
