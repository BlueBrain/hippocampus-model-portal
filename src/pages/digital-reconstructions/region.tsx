import Head from 'next/head';
import RegionView from '@/views/3_digital-reconstructions/Region';

export default function DigRecRegionPage() {
  const metadata = {
    title: 'Region | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Examine the reconstructed digital model of the CA1 region in the hippocampus. Analyze the neuronal populations, layers, and connectivity patterns that shape this vital hippocampal region.',
    keywords: [
      'CA1 Region',
      'Hippocampus',
      'Digital Reconstructions',
      'Neuronal Populations',
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

      <RegionView />
    </>
  );
}