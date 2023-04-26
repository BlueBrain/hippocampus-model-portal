import Head from 'next/head';

import AcetylcholineView from '@/views/reconstruction-data/Acetylcholine';


export default function AcetylcholinePage() {
  return (
    <>
      <Head>
        <title>Acetylcholine / Reconstruction data / SSCx Portal</title>
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
