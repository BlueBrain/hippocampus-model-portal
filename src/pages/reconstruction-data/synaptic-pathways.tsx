import Head from 'next/head';

import SynapticPathwaysView from '../../views/reconstruction-data/SynapticPathways';


export default function RecDataSynapticPathwaysPage() {
  return (
    <>
      <Head>
        <title>Synaptic Pathways / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SynapticPathwaysView />
    </>
  );
}
