import Head from 'next/head';
import OtherFrequenciesView from '@/views/5_predictions/OtherFrequencies';

export default function OtherFrequenciesPage() {
    const metadata = {
        title: 'Other Frequencies - Predictions | The Hippocampus Hub',
        description:
            'Explore predictions based on other frequencies in the hippocampal model. Visualize the spike time, mean firing rate, and traces under different extracellular conditions and cell frequencies.',
        keywords: [
            'Other Frequencies',
            'Spike Time',
            'Firing Rate',
            'Hippocampus',
            'Neuroscience',
            'Predictions',
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

            <OtherFrequenciesView />
        </>
    );
}