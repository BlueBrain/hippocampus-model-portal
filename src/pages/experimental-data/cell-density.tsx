import Head from 'next/head';
import CellDensityView from '@/views/1_experimental-data/CellDensity';

export default function CellDensityPage() {
  const metadata = {
    title: 'Cell Density - Experimental Data | The Hippocampus Hub',
    description: 'Explore detailed data on cell density for different neuronal classes in the hippocampus. View information about the number of cells per unit volume across various regions and species.',
    keywords: [
      'Cell Density',
      'Hippocampus',
      'Experimental Data',
      'Neuroscience',
      'Neuronal Classes',
      'Cellular Data',
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

      <CellDensityView />
    </>
  );
}