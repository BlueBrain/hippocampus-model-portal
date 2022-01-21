import Head from 'next/head';

import SubregionView from '../../views/reconstruction-data/Subregion';


export default function RecDataSubRegionPage() {
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

      <SubregionView />
    </>
  );
}
