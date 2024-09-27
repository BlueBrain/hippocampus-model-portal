import Head from 'next/head';
import ConnectionAnatomyView from '@/views/3_digital-reconstructions/ConnectionAnatomy';

export default function DigRecConnectionsPage() {
  const metadata = {
    title: 'Connection Anatomy | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Explore the anatomical properties of neuronal connections in hippocampal digital reconstructions. This page features data on synapse numbers, synapse distribution, and connectivity pathways.',
    keywords: [
      'Connection Anatomy',
      'Synapses',
      'Connectivity Pathways',
      'Hippocampus',
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

      <ConnectionAnatomyView />
    </>
  );
}