import Head from 'next/head';
import SchafferCollateralsView from '@/views/1_experimental-data/SchafferCollaterals';

export default function SchafferCollateralsPage() {
  const metadata = {
    title: 'Schaffer Collaterals - Experimental Data | The Hippocampus Hub',
    description:
      'Explore detailed experimental data on Schaffer collaterals, including anatomical and physiological properties. Schaffer collaterals are axons that arise from CA3 pyramidal neurons and form synapses with CA1 neurons, providing critical input to the hippocampus.',
    keywords: [
      'Schaffer Collaterals',
      'Hippocampus',
      'Experimental Data',
      'Neuroscience',
      'CA3 Pyramidal Neurons',
      'CA1 Neurons',
      'Axons',
      'Synapses',
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