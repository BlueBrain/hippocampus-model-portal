import Head from 'next/head';
import SchafferCollateralsView from '@/views/3_digital-reconstructions/SchafferCollaterals';

export default function SchafferCollateralsPage() {
  const metadata = {
    title: 'Schaffer Collaterals | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Explore the reconstructed pathways of Schaffer collaterals in the hippocampus. Analyze the anatomy and physiology of Schaffer collaterals, including their synaptic properties and connectivity with CA1 neurons.',
    keywords: [
      'Schaffer Collaterals',
      'Hippocampus',
      'CA1 Neurons',
      'Digital Reconstructions',
      'Synapse Dynamics',
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

      <SchafferCollateralsView />
    </>
  );
}