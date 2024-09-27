import Head from 'next/head';
import SchafferCollateralsView from '@/views/4_validations/SchafferCollaterals_1';

export default function SchafferCollateralsPage() {
  const metadata = {
    title: 'Schaffer Collaterals 1 - Validation | The Hippocampus Hub',
    description:
      'We validated Schaffer collaterals at the synaptic level by comparing model predictions to experimental data on synaptic strength and spike time dynamics.',
    keywords: [
      'Schaffer Collaterals',
      'Synaptic Strength',
      'Spike Time Dynamics',
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

      <SchafferCollateralsView />
    </>
  );
}