import Head from 'next/head';

import SchafferCollateralsView from '../../views/experimental/SchafferCollaterals';


export default function ConnectionPhysiologyPage() {
  return (
    <>
      <Head>
        <title>Schaffer collaterals / Experimental data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <SchafferCollateralsView />
    </>
  );
}
