import Head from 'next/head';
import NeuronModelLibraryView from '@/views/2_reconstruction-data/NeuronModelLibrary';

export default function NeuronModelLibraryPage() {
  const metadata = {
    title: 'Neuron Model Library - Reconstruction Data | The Hippocampus Hub',
    description:
      'Browse a library of single-cell neuron models based on reconstructed morphologies and electrophysiological properties. Examine the detailed parameters and firing behaviors of modeled hippocampal neurons.',
    keywords: [
      'Neuron Model Library',
      'Hippocampus',
      'Electrophysiology',
      'Reconstructed Morphology',
      'Neuron Models',
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

      <NeuronModelLibraryView />
    </>
  );
}