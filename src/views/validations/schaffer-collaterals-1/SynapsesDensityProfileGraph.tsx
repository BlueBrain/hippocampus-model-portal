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

import SynapseDensityProfileData from './synapse-density-profile.json';

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

const SynapsesDensityProfileGraph: React.FC<SynapsesDensityProfileGraphProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            const radialAxis = Object.values(SynapseDensityProfileData.value_map.radial_axis).map(Number);
            const modelData = Object.entries(SynapseDensityProfileData.value_map.model_data).map(([key, value]) => ({
                y: radialAxis[Number(key)],
                x: Number(value)
            }));
            const expData = Object.entries(SynapseDensityProfileData.value_map.exp_data).map(([key, value]) => ({
                y: radialAxis[Number(key)],
                x: Number(value)
            }));

            new Chart(ctx, {
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
                            borderColor: 'red',
                            backgroundColor: 'red',
                            showLine: true,
                            pointRadius: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
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
                            display: true,
                            text: 'PDF',
                        },
                    },
                },
            });
        }
    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(SynapseDensityProfileData, `synapse-density-profile.json`)}>
                    Synapse Density Profile Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesDensityProfileGraph;