import Head from 'next/head';

import ConnectionPhysiologyView from '@/views/validations/ConnectionPhysiology';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Connection physiology / Validations / Hippocampus Hub Explore</title>
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
