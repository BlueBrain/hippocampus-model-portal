import Head from 'next/head';

import NeuronsView from '../../views/reconstruction-data/Neurons';


export default function RecDataNeuronsPage() {
  return (
    <>
      <Head>
        <title>Sub-region / Reconstruction data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <NeuronsView />
    </>
  );
}
