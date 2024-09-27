import Head from 'next/head';
import ConnectionPhysiologyView from '@/views/1_experimental-data/ConnectionPhysiology';

export default function ConnectionPhysiologyPage() {
  const metadata = {
    title: 'Connection Physiology - Experimental Data | The Hippocampus Hub',
    description:
      'Explore detailed data on the physiology of neuronal connections in the hippocampus. Analyze conduction models, PSC (postsynaptic currents), and other physiological properties relevant to neuronal communication.',
    keywords: [
      'Connection Physiology',
      'Conduction Models',
      'Postsynaptic Currents',
      'Hippocampus',
      'Experimental Data',
      'Neuroscience',
      'Neuronal Connections',
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