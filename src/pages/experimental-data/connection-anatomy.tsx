import Head from 'next/head';

import ConnectionAnatomyView from '../../views/experimental-data/ConnectionAnatomy';


export default function ConnectionAnatomyPage() {
  return (
    <>
      <Head>
        <title>Connection anatomy / Experimental data / Hippocampus Hub Explore</title>
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
