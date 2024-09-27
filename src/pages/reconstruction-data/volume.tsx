import Head from 'next/head';
import VolumeView from '@/views/2_reconstruction-data/Volume';

export default function VolumePage() {
  const metadata = {
    title: 'Volume - Reconstruction Data | The Hippocampus Hub',
    description:
      'Explore the reconstructed volume of the CA1 region of the hippocampus. Visualize the 3D structure of CA1, including detailed layers and coordinates, and extract subvolumes of particular interest for further analysis.',
    keywords: [
      'Hippocampus',
      'CA1 Volume',
      '3D Structure',
      'Reconstruction Data',
      'Neuroscience',
      'Blue Brain Project',
      'Coordinate System',
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

      <VolumeView />
    </>
  );
}