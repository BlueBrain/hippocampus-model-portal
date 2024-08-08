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

import SynapticDivergencePercentagesData from './synaptic-divergence-percentages.json';

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

export type SynapticDivergencePercentagesProps = {
    theme?: number;
};

const SynapticDivergencePercentagesGraph: React.FC<SynapticDivergencePercentagesProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(SynapticDivergencePercentagesData, `Synaptic-Divergence-Percentages-Data.json`)}>
                    Synaptic Divergence Percentages Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapticDivergencePercentagesGraph;
