import Head from 'next/head';
import NeuronModelsView from '@/views/2_reconstruction-data/NeuronModels';

export default function NeuronModelsPage() {
  const metadata = {
    title: 'Neuron Models - Reconstruction Data | The Hippocampus Hub',
    description:
      'Examine neuron models developed from a subset of morphologically reconstructed neurons. These models are optimized based on electrophysiological recordings and provide insights into the functional properties of hippocampal neurons.',
    keywords: [
      'Neuron Models',
      'Hippocampus',
      'Electrophysiology',
      'Reconstruction Data',
      'Neuroscience',
      'Blue Brain Project',
      'CA1 Neurons',
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

      <NeuronModelsView />
    </>
  );
}