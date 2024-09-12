import Head from 'next/head';

import OtherFrequenciesView from '@/views/5_predictions/OtherFrequencies';


export default function SpontaneounsActivityPage() {
    return (
        <>
            <Head>
                <title>Other Frequencies / Predictions / Hippocampus Hub Explore</title>
                {/* TODO: add description */}
                <meta
                    name="description"
                    content=""
                />
            </Head>

            <OtherFrequenciesView />
        </>
    );
}
