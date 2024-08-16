import Head from 'next/head';

import AcetylcholineView from '@/views/2_reconstruction-data/Acetylcholine';


export default function AcetylcholinePage() {
  return (
    <>
      <Head>
        <title>Acetylcholine / Reconstruction data / Hippocampus Hub Explore</title>
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
