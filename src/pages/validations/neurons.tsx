import Head from 'next/head';
import NeuronsView from '@/views/4_validations/Neurons';

export default function NeuronsPage() {
    const metadata = {
        title: 'Neurons - Validation | The Hippocampus Hub',
        description:
            'We validated neuron models with experimental data on post-synaptic potential (PSP) and back-propagating action potential (bAP) attenuation in the hippocampus.',
        keywords: [
            'Neurons',
            'PSP',
            'bAP',
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

            <NeuronsView />
        </>
    );
}