import Head from 'next/head';

import MinisView from '@/views/1_experimental-data/Minis';


export default function MinisPage() {
    return (
        <>
            <Head>
                <title>Minis / Experimental data / Hippocampus Hub Explore</title>
                {/* TODO: add description */}
                <meta
                    name="description"
                    content=""
                />
            </Head>

            <MinisView />
        </>
    );
}
