import Head from 'next/head';

import VoltageView from '@/views/predictions/Voltage';


export default function VoltagePage() {
    return (
        <>
            <Head>
                <title>Voltage - Calcium Scan / Predictions / Hippocampus Hub Explore</title>
                {/* TODO: add description */}
                <meta
                    name="description"
                    content=""
                />
            </Head>

            <VoltageView />
        </>
    );
}
