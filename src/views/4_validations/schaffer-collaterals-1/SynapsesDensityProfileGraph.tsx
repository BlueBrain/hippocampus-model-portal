import React, { useEffect, useRef, useState } from 'react';
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

import { graphTheme } from '@/constants';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';

import { dataPath } from '@/config';

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

export type SynapsesDensityProfileGraphProps = {
    theme?: number;
};

interface SynapseDensityProfileData {
    value_map: {
        radial_axis: { [key: string]: number };
        model_data: { [key: string]: number };
        exp_data: { [key: string]: number };
    };
}

const SynapsesDensityProfileGraph: React.FC<SynapsesDensityProfileGraphProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [data, setData] = useState<SynapseDensityProfileData | null>(null); // Specify the type

    useEffect(() => {
        fetch(dataPath + '/4_validations/schaffer-collaterals-1/anatomy/synapse-density-profile.json')
            .then((response) => response.json())
            .then((data: SynapseDensityProfileData) => setData(data)); // Explicitly type the fetched data
    }, []);

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, []);

    useEffect(() => {
        if (chartRef.current && windowSize.width > 0 && data) {
            const ctx = chartRef.current.getContext('2d');

            if (!ctx) return;

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const radialAxis = Object.values(data.value_map.radial_axis).map(Number);
            const modelData = Object.entries(data.value_map.model_data).map(([key, value]) => ({
                y: radialAxis[Number(key)],
                x: Number(value)
            }));
            const expData = Object.entries(data.value_map.exp_data).map(([key, value]) => ({
                y: radialAxis[Number(key)],
                x: Number(value)
            }));

            chartInstanceRef.current = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Model Data',
                            data: modelData,
                            borderColor: 'black',
                            backgroundColor: 'black',
                            showLine: true,
                            pointRadius: 0,
                        },
                        {
                            label: 'Experimental Data',
                            data: expData,
                            borderColor: graphTheme.red,
                            backgroundColor: 'red',
                            showLine: true,
                            pointRadius: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Synapses/μm³',
                            },
                            min: 0,
                            max: 0.025,
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Radial axis',
                            },
                            min: 0,
                            max: 1,
                        },
                    },
                    plugins: {
                        title: {
                            display: false,
                            text: 'PDF',
                        },
                    },
                },
            });
        }
    }, [chartRef, windowSize, data]);

    return (
        <div>
            <div className="graph flex justify-center items-center">
                <div className="w-1/2 h-[500px]">
                    <canvas ref={chartRef} />
                </div>
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => data && downloadAsJson(data, `synapse-density-profile.json`)}>
                    Synapse Density Profile Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesDensityProfileGraph;