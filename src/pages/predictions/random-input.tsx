import Head from 'next/head';
import SpontaneousActivityView from '@/views/5_predictions/SpontaneounsActivity';

export default function SpontaneousActivityPage() {
    const metadata = {
        title: 'Random Input - Predictions | The Hippocampus Hub',
        description:
            '',
        keywords: [
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

            <SpontaneousActivityView />
        </>
    );
}