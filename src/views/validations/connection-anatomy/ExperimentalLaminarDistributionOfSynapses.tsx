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

import ExperimentalLaminarDistributionOfSynapsesData from './experimental-laminar-distribution-of-synapses.json';

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

export type ExperimentalLaminarDistributionOfSynapsesProps = {
    theme?: number;
};

const ExperimentalLaminarDistributionOfSynapsesGraph: React.FC<ExperimentalLaminarDistributionOfSynapsesProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(ExperimentalLaminarDistributionOfSynapsesData, `Experimental-Laminar-Distribution-Of-Synapses-Data.json`)}>
                    Experimental Laminar Distribution Of Synapses Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default ExperimentalLaminarDistributionOfSynapsesGraph;
