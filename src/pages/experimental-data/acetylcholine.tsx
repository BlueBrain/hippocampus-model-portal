import Head from 'next/head';

import AcetylcholineView from '@/views/experimental-data/Acetylcholine';


export default function AcetylcholinePage() {
  return (
    <>
      <Head>
        <title>Acetylcholine / Experimental data / SSCx Portal</title>
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
