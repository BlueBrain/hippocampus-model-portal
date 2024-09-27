import Head from 'next/head';
import LayerAnatomyView from '../../views/1_experimental-data/LayerAnatomy';

export default function LayerAnatomyPage() {
  const metadata = {
    title: 'Layer Anatomy - Experimental Data | The Hippocampus Hub',
    description: 'Explore the laminar structure of the rat hippocampus CA1, organized into six layers. View detailed data on layer thickness and distribution across the stratum oriens, pyramidale, radiatum, and lacunosum-moleculare.',
    keywords: ['Hippocampus', 'CA1', 'Layer Anatomy', 'Stratum Oriens', 'Stratum Pyramidale', 'Stratum Radiatum', 'Stratum Lacunosum-Moleculare', 'Neuroscience', 'Experimental Data'],
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

      <LayerAnatomyView />
    </>
  );
}