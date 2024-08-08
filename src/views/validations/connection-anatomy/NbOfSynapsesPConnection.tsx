import React, { useEffect, useRef } from 'react';
import {
    Chart,
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
} from 'chart.js';

import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

import NbOfSynapsesPConnectionData from './nb-of-synapses-p-connection.json';

Chart.register(
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title
);

export type NbOfSynapsesPConnectionProps = {
    theme?: number;
};

const NbOfSynapsesPConnectionGraph: React.FC<NbOfSynapsesPConnectionProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(NbOfSynapsesPConnectionData, `Nb-Of-Synapses-Per-Connection-Data.json`)}>
                    Number Of Synapses Per Connection Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default NbOfSynapsesPConnectionGraph;
