import React from 'react';
import Head from 'next/head';

import NeuronsView from '@/views/validations/Neurons';


export default function NeuronsPage() {
    return (
        <>
            <Head>
                <title>Neurons / Validations / Hippocampus Hub Explore</title>
                {/* TODO: add description */}
                <meta
                    name="description"
                    content=""
                />
            </Head>

            <NeuronsView />
        </>
    );
};
