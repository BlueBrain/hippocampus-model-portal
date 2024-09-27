import Head from 'next/head';
import ConnectionAnatomyView from '../../views/4_validations/ConnnectionAnatomy';

export default function ConnectionAnatomyPage() {
  const metadata = {
    title: 'Pathway Anatomy - Validation | The Hippocampus Hub',
    description:
      'We validated pathway anatomy with experimental data, including synaptic connection densities, bouton densities, and synapse divergence and convergence ratios.',
    keywords: [
      'Pathway Anatomy',
      'Synapse Density',
      'Bouton Density',
      'Divergence Ratios',
      'Convergence Ratios',
      'Validation Data',
      'Hippocampus',
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

      <ConnectionAnatomyView />
    </>
  );
}