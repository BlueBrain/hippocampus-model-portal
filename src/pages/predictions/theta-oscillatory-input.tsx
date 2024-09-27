import Head from 'next/head';
import ThetaOscillatoryInputView from '@/views/5_predictions/ThetaOscillatoryInput';

export default function ThetaOscillatoryInputPage() {
    const metadata = {
        title: 'Theta - Oscillatory Input - Predictions | The Hippocampus Hub',
        description:
            'Predict the effects of oscillatory theta input on CA1 neurons. Explore how rhythmic input from CA3 to CA1 drives activity, affecting spike time, mean firing rate, and membrane potential.',
        keywords: [
            'Theta Oscillatory Input',
            'CA1',
            'CA3',
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

            <ThetaOscillatoryInputView />
        </>
    );
}