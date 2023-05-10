import Head from 'next/head';

import SchafferCollateralsView from '@/views/digital-reconstructions/SchafferCollaterals';


export default function SchafferCollateralsPage() {
  return (
    <>
      <Head>
        <title>Schaffer collaterals / Digital reconstructions / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SchafferCollateralsView />
    </>
  );
}
