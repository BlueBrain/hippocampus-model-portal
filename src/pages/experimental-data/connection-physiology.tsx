import Head from 'next/head';

import ConnectionPhysiologyView from '@/views/experimental-data/ConnectionPhysiology';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Connection physiology / Experimental data / SSCx Portal</title>
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
