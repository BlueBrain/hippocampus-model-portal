import Head from 'next/head';

import LayerAnatomyView from '../../views/experimental/LayerAnatomy';


export default function LayerAnatomyPage() {
  return (
    <>
      <Head>
        <title>Layer anatomy / Experimental data / SSCx Portal</title>
        {/* TODO: replace with proper text */}
        <meta
          name="description"
          content="The Somatosensory Cortex has a laminar structure where neurons are organized across six distinct layers."
        />
      </Head>

      <LayerAnatomyView />
    </>
  );
}
