import Head from 'next/head';

import AcetylcholineView from '@/views/3_digital-reconstructions/AcetylcholineEffectsOnCell';


export default function AcetylcholinePage() {
  return (
    <>
      <Head>
        <title>Acetylcholine - Effects on Cells / Digital reconstructions / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <AcetylcholineView />
    </>
  );
}
