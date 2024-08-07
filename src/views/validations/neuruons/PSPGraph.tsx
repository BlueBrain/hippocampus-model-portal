import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Title,
} from 'chart.js';
import BAPData from './psp.json'; // Ensure this path is correct
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

// Register necessary components
Chart.register(
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Title
);

export type PSPGraphProps = {
    theme?: number;
};

const PSPGraph: React.FC<PSPGraphProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph mb-4">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(BAPData, `bAP-data.json`)}>
                    bAP Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default PSPGraph;
