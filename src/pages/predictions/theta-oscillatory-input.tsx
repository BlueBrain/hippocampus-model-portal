import Head from 'next/head';

import ThetaOscillatoryInputView from '@/views/predictions/ThetaOscillatoryInput';


export default function ThetaOscillatoryInputPage() {
    return (
        <>
            <Head>
                <title>Theta - Oscillatory input / Predictions / Hippocampus Hub Explore</title>
                {/* TODO: add description */}
                <meta
                    name="description"
                    content=""
                />
            </Head>

            <ThetaOscillatoryInputView />
        </>
    );
}
