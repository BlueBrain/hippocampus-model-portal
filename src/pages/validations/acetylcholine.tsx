import Head from 'next/head';
import AcetylcholineView from '@/views/4_validations/Acetylcholine';

export default function AcetylcholinePage() {
  const metadata = {
    title: 'Acetylcholine - Validation | The Hippocampus Hub',
    description:
      'We validated the impact of acetylcholine at the network level using available data from literature. Different network dynamics were observed depending on the concentration of acetylcholine.',
    keywords: [
      'Acetylcholine',
      'Network Activity',
      'Synapse Modulation',
      'Validation Data',
      'Hippocampus',
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