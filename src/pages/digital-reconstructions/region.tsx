import Head from 'next/head';

import RegionView from '@/views/digital-reconstructions/Region';


export default function DigRecRegionPage() {
  return (
    <>
      <Head>
        <title>Region / Digital reconstructions / Hippocampus Hub Explore</title>
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
