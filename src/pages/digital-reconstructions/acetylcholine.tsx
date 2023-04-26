import Head from 'next/head';

import AcetylcholineView from '@/views/digital-reconstructions/Acetylcholine';


export default function AcetylcholinePage() {
  return (
    <>
      <Head>
        <title>Acetylcholine / Digital reconstructions / SSCx Portal</title>
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
