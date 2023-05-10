import Head from 'next/head';

import AcetylcholineView from '@/views/validations/Acetylcholine';


export default function AcetylcholinePage() {
  return (
    <>
      <Head>
        <title>Acetylcholine / Validations / Hippocampus Hub Explore</title>
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
