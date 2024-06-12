import Head from 'next/head';

import ConnectionAnatomyView from '../../views/validations/ConnectionAnatomy';


export default function ConnectionAnatomyPage() {
  return (
    <>
      <Head>
        <title>Connection anatomy / Validations / Hippocampus Hub Explore</title>
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
