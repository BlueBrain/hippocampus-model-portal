import Head from 'next/head';

import SubregionView from '../../views/digital-reconstructions/Subregion';


export default function DigRecSubregionPage() {
  return (
    <>
      <Head>
        <title>Sub-region / Digital reconstructions / SSCx Portal</title>
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
