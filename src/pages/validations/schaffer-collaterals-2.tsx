import Head from 'next/head';
import SchafferCollateralsView from '@/views/4_validations/SchafferCollaterals_2';

export default function SchafferCollateralsTwoPage() {
  const metadata = {
    title: 'Schaffer Collaterals 2 - Validation | The Hippocampus Hub',
    description:
      'We validated Schaffer collaterals at the network level by reproducing experiments from Sasaki et al. (2006) under different stimulation and inhibition conditions.',
    keywords: [
      'Schaffer Collaterals',
      'Network Dynamics',
      'Inhibition',
      'Stimulation Conditions',
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