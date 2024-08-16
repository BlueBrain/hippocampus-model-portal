import Head from 'next/head';

import ConnnectionPhysiologyView from '@/views/4_validations/ConnnectionPhysiology';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Connection Physiology / Validations / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <ConnnectionPhysiologyView />
    </>
  );
}
