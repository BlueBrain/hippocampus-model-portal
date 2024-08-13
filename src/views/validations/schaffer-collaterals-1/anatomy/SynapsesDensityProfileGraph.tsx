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
    const chartInstanceRef = useRef(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Set initial size
        updateWindowSize();

        // Add event listener
        window.addEventListener('resize', updateWindowSize);

        // Clean up
        return () => window.removeEventListener('resize', updateWindowSize);
    }, []);

    useEffect(() => {
        if (chartRef.current && windowSize.width > 0) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy the previous chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const radialAxis = Object.values(SynapseDensityProfileData.value_map.radial_axis).map(Number);
            const modelData = Object.entries(SynapseDensityProfileData.value_map.model_data).map(([key, value]) => ({
                y: radialAxis[Number(key)],
                x: Number(value)
            }));
            const expData = Object.entries(SynapseDensityProfileData.value_map.exp_data).map(([key, value]) => ({
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
    }, [chartRef, windowSize]);

    return (
        <div>
            <div className="graph flex justify-center items-center">
                <div className="w-1/2 h-[500px]">
                    <canvas ref={chartRef} />
                </div>
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