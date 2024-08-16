import Head from 'next/head';

import ConnectionAnatomyView from '../../views/4_validations/ConnnectionAnatomy';


export default function ConnectionAnatomyPage() {
  return (
    <>
      <Head>
        <title>Pathway anatomy / Validations / Hippocampus Hub Explore</title>
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
