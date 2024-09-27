import Head from 'next/head';
import MorphologyLibraryView from '@/views/2_reconstruction-data/MorphologyLibrary';

export default function MorphologyLibraryPage() {
  const metadata = {
    title: 'Morphology Library - Reconstruction Data | The Hippocampus Hub',
    description:
      'Explore a comprehensive library of neuronal morphologies reconstructed from hippocampal neurons. Analyze key morphological features such as total axon length, dendritic segments, and soma diameter.',
    keywords: [
      'Morphology Library',
      'Neuronal Morphology',
      'Hippocampus',
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

      <MorphologyLibraryView />
    </>
  );
}