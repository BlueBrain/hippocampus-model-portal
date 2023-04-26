import Head from 'next/head';

import ThetaView from '@/views/experimental-data/Theta';


export default function ThetaPage() {
  return (
    <>
      <Head>
        <title>Theta / Experimental data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <ThetaView />
    </>
  );
}
