import Head from 'next/head';
import ConnectionPhysiologyView from '@/views/2_reconstruction-data/ConnectionPhysiology';

export default function ConnectionPhysiologyPage() {
  const metadata = {
    title: 'Connection Physiology - Reconstruction Data | The Hippocampus Hub',
    description:
      'Examine the physiological properties of synaptic connections in the hippocampus, including pre- and post-synaptic parameters such as synaptic conductance, decay times, and receptor dynamics.',
    keywords: [
      'Connection Physiology',
      'Hippocampus',
      'Synaptic Conductance',
      'Pre-Synaptic',
      'Post-Synaptic',
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

      <ConnectionPhysiologyView />
    </>
  );
}