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

import DivergenceValidationData from './divergence-validation.json';

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

export type DivergenceValidationProps = {
    theme?: number;
};

const DivergenceValidationGraph: React.FC<DivergenceValidationProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(DivergenceValidationData, `Divergence-Validation-Data.json`)}>
                    DivergenceValidation Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default DivergenceValidationGraph;
