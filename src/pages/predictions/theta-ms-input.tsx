import Head from 'next/head';
import ThetaMSInputView from '@/views/5_predictions/ThetaMSInput';

export default function ThetaMSInputPage() {
    const metadata = {
        title: 'Theta - MS Input - Predictions | The Hippocampus Hub',
        description:
            'Simulate theta rhythmic activity in hippocampal neurons by modeling medial septum (MS) input. Explore spike time, firing rate, and membrane potential traces to understand the effect of rhythmic depolarization.',
        keywords: [
            'Theta',
            'MS Input',
            'Spike Time',
            'Firing Rate',
            'Hippocampus',
            'Neuroscience',
            'Blue Brain Project',
            'The Hippocampus Hub',
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

            <ThetaMSInputView />
        </>
    );
}