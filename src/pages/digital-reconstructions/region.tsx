import Head from 'next/head';

import RegionView from '@/views/digital-reconstructions/Region';


export default function DigRecRegionPage() {
  return (
    <>
      <Head>
        <title>Region / Digital reconstructions / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <RegionView />
    </>
  );
}
