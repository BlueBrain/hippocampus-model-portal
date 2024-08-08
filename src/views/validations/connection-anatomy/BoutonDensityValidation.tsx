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

import BoutonDensityValidationData from './bouton-density-validation.json';

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

export type BoutonDensityValidationProps = {
    theme?: number;
};

const BoutonDensityValidationGraph: React.FC<BoutonDensityValidationProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {

    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(BoutonDensityValidationData, `Bouton-Density-Validation-Data.json`)}>
                    Bouton Density Validation Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default BoutonDensityValidationGraph;
