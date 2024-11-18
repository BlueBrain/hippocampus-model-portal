import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Viewer from './Viewer/Viewer';
import { assertType } from './type-guards';
import { Bounds } from './types';
import { dataPath } from '@/config';

const CoordinatesViewer: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const start = async () => {
            const info = await loadInfo(`${dataPath}/3d/2_reconstruction-data/coordinates/mesh.json`);
            const elemData = new Uint32Array(await loadData(`${dataPath}/3d/2_reconstruction-data/coordinates/elem.dat`));
            const vertData = new Float32Array(await loadData(`${dataPath}/3d/2_reconstruction-data/coordinates/vert.dat`));
            const container = document.getElementById('root') as HTMLElement;
            const root = createRoot(container);
            root.render(<Viewer meshInfo={info} vert={vertData} elem={Array.from(elemData)} />);

        };

        start();
    }, []);

    return <div id="root">{loading && <p>Loading...</p>}</div>;
};

async function loadData(url: string): Promise<ArrayBuffer> {
    const resp = await fetch(url);
    return await resp.arrayBuffer();
}

async function loadInfo(url: string): Promise<Bounds> {
    const resp = await fetch(url);
    const data = await resp.json();
    assertType<Bounds>(data, {
        min: ['array(3)', 'number'],
        max: ['array(3)', 'number'],
    });
    return data;
}

export default CoordinatesViewer;
