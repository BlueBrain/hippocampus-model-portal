import Head from 'next/head';
import ConnnectionPhysiologyView from '@/views/4_validations/ConnnectionPhysiology';

export default function ConnectionPhysiologyPage() {
  const metadata = {
    title: 'Connection Physiology - Validation | The Hippocampus Hub',
    description:
      'We validated the synaptome with data on post-synaptic potential (PSP) and coefficient of variation (CV) of the first PSP.',
    keywords: [
      'Connection Physiology',
      'PSP',
      'Synaptome',
      'Coefficient of Variation',
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

      <ConnnectionPhysiologyView />
    </>
  );
}