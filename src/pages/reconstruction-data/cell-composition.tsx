import Head from 'next/head';
import CellCompositionView from '@/views/2_reconstruction-data/CellComposition';

export default function CellCompositionPage() {
  const metadata = {
    title: 'Cell Composition - Reconstruction Data | The Hippocampus Hub',
    description:
      'Explore the density and number of cells for each morphological type in the CA1 region of the hippocampus. Analyze the composition of morpho-electrical types (me-types) based on electrophysiological recordings and reconstructions.',
    keywords: [
      'Cell Composition',
      'Hippocampus',
      'CA1 Neurons',
      'Morpho-Electrical Types',
      'Cell Density',
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

      <CellCompositionView />
    </>
  );
}