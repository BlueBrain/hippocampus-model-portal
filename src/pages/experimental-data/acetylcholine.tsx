import Head from 'next/head';
import AcetylcholineView from '@/views/1_experimental-data/Acetylcholine';

export default function AcetylcholinePage() {
  const metadata = {
    title: 'Acetylcholine - Experimental Data | The Hippocampus Hub',
    description:
      'Explore experimental data on the effects of Acetylcholine (ACh) on hippocampal neurons, including its impact on resting membrane potential, firing rate, synaptic function, and network activity. Acetylcholine plays a crucial role in modulating neuronal activity in the hippocampus.',
    keywords: [
      'Acetylcholine',
      'Resting Membrane Potential',
      'Firing Rate',
      'Synapses',
      'Hippocampus',
      'Neuroscience',
      'Network Activity',
      'Experimental Data',
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