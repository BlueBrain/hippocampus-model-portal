import Head from 'next/head';
import ConnectionPhysiologyView from '../../views/3_digital-reconstructions/ConnectionPhysiology';

export default function ConnectionPhysiologyPage() {
  const metadata = {
    title: 'Connection Physiology | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Analyze the physiological properties of synaptic connections in digital reconstructions of the hippocampus. This page includes data on synaptic conductance, synapse dynamics, and receptor properties.',
    keywords: [
      'Connection Physiology',
      'Synaptic Conductance',
      'Hippocampus',
      'Synapse Dynamics',
      'Digital Reconstructions',
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

      <ConnectionPhysiologyView />
    </>
  );
}