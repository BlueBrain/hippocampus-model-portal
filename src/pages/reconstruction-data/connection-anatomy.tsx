import Head from 'next/head';
import ConnectionAnatomyView from '@/views/2_reconstruction-data/ConnectionAnatomy';

export default function ConnectionAnatomyPage() {
  const metadata = {
    title: 'Connection Anatomy - Reconstruction Data | The Hippocampus Hub',
    description:
      'Explore the anatomical properties of neuronal connections in the hippocampus. Analyze synapse numbers, bouton density, and the relationship between synaptic appositions and connectivity pathways.',
    keywords: [
      'Connection Anatomy',
      'Hippocampus',
      'Synapses',
      'Bouton Density',
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

      <ConnectionAnatomyView />
    </>
  );
}