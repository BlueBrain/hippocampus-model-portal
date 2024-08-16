import Head from 'next/head';

import SchafferCollateralsView from '@/views/2_reconstruction-data/SchafferCollaterals';


export default function SchafferCollateralsPage() {
  return (
    <>
      <Head>
        <title>Schaffer collaterals / Experimental data / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SchafferCollateralsView />
    </>
  );
}
