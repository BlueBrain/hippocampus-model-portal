import Head from 'next/head';

import MicrocircuitsView from '../../views/digital-reconstructions/Microcircuits';


export default function DigRecMicrocircuitsPage() {
  return (
    <>
      <Head>
        <title>Microcircuits / Digital reconstructions / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <MicrocircuitsView />
    </>
  );
}
