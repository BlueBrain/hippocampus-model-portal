import Head from 'next/head';

import ConnectionPhysiologyView from '../../views/3_digital-reconstructions/ConnectionPhysiology';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Connection Physiology / Digital reconstructions / Hippocampus Hub Explore</title>
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
