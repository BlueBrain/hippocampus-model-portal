import Head from 'next/head';
import AcetylcholineView from '@/views/3_digital-reconstructions/AcetylcholineEffectsOnSynapses';

export default function AcetylcholinePage() {
  const metadata = {
    title: 'Acetylcholine - Effects on Synapses | Digital Reconstructions | The Hippocampus Hub',
    description:
      'Explore the effects of acetylcholine (ACh) on synaptic plasticity in hippocampal neurons. This page presents dose-effect relationships and key parameters that influence short-term plasticity in synapses.',
    keywords: [
      'Acetylcholine',
      'Synapses',
      'Short-Term Plasticity',
      'Dose-Effect',
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