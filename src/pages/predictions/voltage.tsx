import Head from 'next/head';
import VoltageView from '@/views/5_predictions/Voltage';

export default function VoltagePage() {
    const metadata = {
        title: 'Voltage - Calcium Scan - Predictions | The Hippocampus Hub',
        description:
            'Explore predictions of network excitability under varying extracellular calcium concentrations and ionic conditions. Visualize the spike time, mean firing rate, and traces for CA1 neurons in different voltage-calcium scenarios.',
        keywords: [
            'Voltage',
            'Calcium Scan',
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

            <VoltageView />
        </>
    );
}