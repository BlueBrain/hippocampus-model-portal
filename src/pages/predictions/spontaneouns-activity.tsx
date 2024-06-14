import Head from 'next/head';

import SpontaneounsActivityView from '@/views/predictions/SpontaneounsActivity';


export default function SpontaneounsActivityPage() {
  return (
    <>
      <Head>
        <title>Sponaneous Activity / Predictions / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SpontaneounsActivityView />
    </>
  );
}
