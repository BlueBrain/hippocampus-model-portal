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

import ConvergenceValidationData from './convergence-validation.json';

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

export type ConvergenceValidationProps = {
    theme?: number;
};

const ConvergenceValidationGraph: React.FC<ConvergenceValidationProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(ConvergenceValidationData, `Convergence-Validation-Data.json`)}>
                    Convergence Validation Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default ConvergenceValidationGraph;
