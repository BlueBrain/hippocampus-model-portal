import Head from 'next/head';
import NeuronsView from '../../views/3_digital-reconstructions/Neurons';

export default function DigRecNeuronsPage() {
  const metadata = {
    title: 'Neurons | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Explore a library of neuron reconstructions in the hippocampus. Analyze the detailed neuron models that populate the network, based on reconstructed morphologies and electrophysiological recordings.',
    keywords: [
      'Neuron Models',
      'Hippocampus',
      'Digital Reconstructions',
      'Reconstructed Morphology',
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

      <NeuronsView />
    </>
  );
}