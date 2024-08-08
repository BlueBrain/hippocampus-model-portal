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

import ModelLaminarDistributionOfDynapsesData from './model-laminar-distribution-of-synapses.json';

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

export type ModelLaminarDistributionOfDynapsesProps = {
    theme?: number;
};

const ModelLaminarDistributionOfDynapsesGraph: React.FC<ModelLaminarDistributionOfDynapsesProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(ModelLaminarDistributionOfDynapsesData, `Model-Laminar-Distribution-Of-Synapses-Data.json`)}>
                    Model Laminar Distribution Of Dynapses Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default ModelLaminarDistributionOfDynapsesGraph;
