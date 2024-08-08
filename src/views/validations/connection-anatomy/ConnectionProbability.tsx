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

import ConnectionProbabilityData from './connection-probability.json';

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

export type ConnectionProbabilityProps = {
    theme?: number;
};

const ConnectionProbabilityGraph: React.FC<ConnectionProbabilityProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(ConnectionProbabilityData, `Connection-Probability-Data.json`)}>
                    Connection Probability Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default ConnectionProbabilityGraph;
