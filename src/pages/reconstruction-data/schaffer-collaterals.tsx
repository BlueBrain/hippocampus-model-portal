import Head from 'next/head';
import SchafferCollateralsView from '@/views/2_reconstruction-data/SchafferCollaterals';

export default function SchafferCollateralsPage() {
  const metadata = {
    title: 'Schaffer Collaterals - Reconstruction Data | The Hippocampus Hub',
    description:
      'Explore the anatomy and physiology of Schaffer collaterals, the axons arising from CA3 pyramidal neurons that form synapses with CA1 neurons. Analyze the detailed connectivity patterns and physiological properties of Schaffer collateral pathways.',
    keywords: [
      'Schaffer Collaterals',
      'Hippocampus',
      'CA1 Neurons',
      'CA3 Pyramidal Neurons',
      'Anatomy',
      'Physiology',
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

      <SchafferCollateralsView />
    </>
  );
}