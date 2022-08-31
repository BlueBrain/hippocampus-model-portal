import Head from 'next/head';

import SynapsesView from '../../views/digital-reconstructions/Synapses';


export default function SynapsesPage() {
  return (
    <>
      <Head>
        <title>Synapses / Digital reconstructions / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SynapsesView />
    </>
  );
}
