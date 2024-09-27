import Head from 'next/head';
import AcetylcholineView from '@/views/3_digital-reconstructions/AcetylcholineEffectsOnCell';

export default function AcetylcholinePage() {
  const metadata = {
    title: 'Acetylcholine - Effects on Cells | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Examine the dose-effect relationship of acetylcholine (ACh) on hippocampal neurons, focusing on membrane potential and firing rate. Analyze the dynamic changes induced by ACh across various cell types.',
    keywords: [
      'Acetylcholine',
      'Neurons',
      'Dose-Effect',
      'Membrane Potential',
      'Firing Rate',
      'Hippocampus',
      'Digital Reconstructions',
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

      <AcetylcholineView />
    </>
  );
}