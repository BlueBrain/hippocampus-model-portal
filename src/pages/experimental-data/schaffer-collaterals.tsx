import Head from 'next/head';

import SchafferCollateralsView from '@/views/1_experimental-data/SchafferCollaterals';


export default function ConnectionPhysiologyPage() {
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
