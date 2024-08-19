import Head from 'next/head';

import ThetaMSInputView from '@/views/5_predictions/ThetaMSInput';


export default function ThetaMSInputPage() {
    return (
        <>
            <Head>
                <title>Theta - MS input / Predictions / Hippocampus Hub Explore</title>
                {/* TODO: add description */}
                <meta
                    name="description"
                    content=""
                />
            </Head>

            <ThetaMSInputView />
        </>
    );
}
