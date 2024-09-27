import Head from 'next/head';
import NeuronMorphologyView from '../../views/1_experimental-data/NeuronalMorphology';

export default function NeuronMorphologyPage() {
  const metadata = {
    title: 'Neuronal Morphology - Experimental Data | The Hippocampus Hub',
    description: 'Explore detailed neuronal morphology data from the rat hippocampus. View and analyze the structural characteristics of neurons, including dendritic and axonal patterns, in the CA1 region.',
    keywords: ['Neuronal Morphology', 'Hippocampus', 'CA1', 'Dendrites', 'Axons', 'Neuron Structure', 'Experimental Data', 'Neuroscience'],
    authors: [{ name: 'Blue Brain Project' }],
    creator: 'EPFL Blue Brain Project',
    publisher: 'The Hippocampus Hub',
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="author" content={metadata.authors[0].name} />
        <meta name="creator" content={metadata.creator} />
        <meta name="publisher" content={metadata.publisher} />
      </Head>

      <NeuronMorphologyView />
    </>
  );
}