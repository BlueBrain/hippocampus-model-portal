import Head from 'next/head';
import NeuronElectrophysiologyView from '../../views/1_experimental-data/NeuronElectrophysiology';

export default function NeuronElectrophysiologyPage() {
  const metadata = {
    title: 'Neuron Electrophysiology - Experimental Data | The Hippocampus Hub',
    description:
      'Explore neuron electrophysiology data collected from the rat hippocampus. Analyze electrical traces recorded from neurons during single-cell recordings.',
    keywords: [
      'Neuron Electrophysiology',
      'Hippocampus',
      'Experimental Data',
      'Neuroscience',
      'Single-cell recordings',
      'Electrical Traces',
      'Blue Brain Project',
    ],
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

      {/* Render the NeuronElectrophysiologyView component */}
      <NeuronElectrophysiologyView />
    </>
  );
}