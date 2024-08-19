import Head from 'next/head';

import ConnectionPhysiologyView from '@/views/1_experimental-data/ConnectionPhysiology';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Connection physiology / Experimental data / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <ConnectionPhysiologyView />
    </>
  );
}
