import Head from 'next/head';
import ConnectionAnatomyView from '../../views/1_experimental-data/ConnectionAnatomy';

export default function ConnectionAnatomyPage() {
  const metadata = {
    title: 'Connection Anatomy - Experimental Data | The Hippocampus Hub',
    description:
      'Explore comprehensive data on connection anatomy, including synaptic density, connectivity, and anatomical pathways in the hippocampus. Analyze the synapse distribution across different regions and populations of neurons.',
    keywords: [
      'Connection Anatomy',
      'Synaptic Density',
      'Hippocampus',
      'Experimental Data',
      'Neuroscience',
      'Anatomical Connections',
      'Synapse Distribution',
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