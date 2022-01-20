import Head from 'next/head';

import ConnectionAnatomyView from '../../views/experimental/ConnectionAnatomy';


export default function ConnectionAnatomyPage() {
  return (
    <>
      <Head>
        <title>Connection anatomy / Experimental data / SSCx Portal</title>
        {/* TODO: add description */}
        <meta
          name="description"
          content=""
        />
      </Head>

      <ConnectionAnatomyView />
    </>
  );
}
