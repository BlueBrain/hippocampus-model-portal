import React from 'react';
import Head from 'next/head';

import SchafferCollateralsView from '@/views/4_validations/SchafferCollaterals_2';


export default function SchafferCollateralsTwoPage() {
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
