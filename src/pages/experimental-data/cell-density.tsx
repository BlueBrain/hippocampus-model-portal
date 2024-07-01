import Head from 'next/head';

import CellDensityView from '@/views/experimental-data/CellDensity';


export default function ThetaPage() {
  return (
    <>
      <Head>
        <title>Cell Density / Experimental data / Hippocampus Hub Explore</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <CellDensityView />
    </>
  );
}
