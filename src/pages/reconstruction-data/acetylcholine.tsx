import Head from 'next/head';
import AcetylcholineView from '@/views/2_reconstruction-data/Acetylcholine';

export default function AcetylcholinePage() {
  const metadata = {
    title: 'Acetylcholine - Reconstruction Data | The Hippocampus Hub',
    description:
      'Analyze the dose-effect behavior of acetylcholine (ACh) on CA1 neurons and synapses. Explore dose-dependent changes in depolarizing currents and synaptic release probability.',
    keywords: [
      'Acetylcholine',
      'Hippocampus',
      'Dose-Effect Behavior',
      'Neurons',
      'Synapses',
      'Reconstruction Data',
      'Neuroscience',
      'Blue Brain Project',
    ],
    author: 'Blue Brain Project',
    creator: 'EPFL Blue Brain Project',
    publisher: 'The Hippocampus Hub',
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="author" content={metadata.author} />
        <meta name="creator" content={metadata.creator} />
        <meta name="publisher" content={metadata.publisher} />
      </Head>

      <AcetylcholineView />
    </>
  );
}