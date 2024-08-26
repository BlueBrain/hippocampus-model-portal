import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ChartConfiguration,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Legend,
    Tooltip,
    ScatterDataPoint
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { dataPath } from '@/config';
import { graphTheme } from '@/constants';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Legend,
    Tooltip
);

interface SynapsesDensityData {
    name: string;
    description: string;
    units: string;
    value_map: {
        distance: { [key: string]: number };
        model_mean: { [key: string]: number };
        model_std: { [key: string]: number };
        exp_mean: { [key: string]: number };
        exp_std: { [key: string]: number };
    };
}

interface SynapsesDensityProfileGraphProps {
    theme: number;
}

interface ExtendedScatterDataPoint extends ScatterDataPoint {
    yMin: number;
    yMax: number;
}

const SynapsesDensityProfileGraph: React.FC<SynapsesDensityProfileGraphProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [data, setData] = useState<SynapsesDensityData | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        fetch(dataPath + '/4_validations/schaffer-collaterals-1/synapses-density-profile.json')
            .then(response => response.json())
            .then(jsonData => setData(jsonData))
            .catch(error => console.error('Error fetching synapses density profile data:', error));
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (chartRef.current && windowSize.width > 0 && data) {
            const ctx = chartRef.current.getContext('2d');

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            if (ctx) {
                const modelDataset = Object.keys(data.value_map.distance).map(key => ({
                    x: data.value_map.distance[key],
                    y: data.value_map.model_mean[key],
                    yMin: data.value_map.model_mean[key] - data.value_map.model_std[key],
                    yMax: data.value_map.model_mean[key] + data.value_map.model_std[key],
                }));

                const expDataset = Object.keys(data.value_map.distance).map(key => ({
                    x: data.value_map.distance[key],
                    y: data.value_map.exp_mean[key],
                    yMin: data.value_map.exp_mean[key] - data.value_map.exp_std[key],
                    yMax: data.value_map.exp_mean[key] + data.value_map.exp_std[key],
                }));

                const config: ChartConfiguration<'line', ExtendedScatterDataPoint[]> = {
                    type: 'line',
                    data: {
                        datasets: [
                            {
                                label: 'Model',
                                data: modelDataset,
                                borderColor: 'black',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                fill: false,
                                pointStyle: 'circle',
                            },
                            {
                                label: 'Experiment',
                                data: expDataset,
                                borderColor: graphTheme.red,
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                fill: false,
                                pointStyle: 'circle',
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'Distance (µm)',
                                }
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: data.units,
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            },
                            legend: {
                                position: 'top',
                            },
                        }
                    },
                    plugins: [{
                        id: 'errorBars',
                        afterDatasetsDraw(chart) {
                            const { ctx, data, scales } = chart;
                            if (!scales.x || !scales.y) return;

                            data.datasets.forEach((dataset, i) => {
                                const meta = chart.getDatasetMeta(i);

                                meta.data.forEach((datapoint, index) => {
                                    const { x: xPos } = datapoint.getProps(['x']);
                                    const yPos = datapoint.getProps(['y']).y;

                                    const extendedData = dataset.data[index] as ExtendedScatterDataPoint;
                                    if (extendedData.yMin === undefined || extendedData.yMax === undefined) return;

                                    const yTop = scales.y.getPixelForValue(extendedData.yMax);
                                    const yBottom = scales.y.getPixelForValue(extendedData.yMin);

                                    ctx.save();
                                    ctx.strokeStyle = dataset.borderColor as string;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(xPos, yBottom);
                                    ctx.lineTo(xPos, yTop);
                                    ctx.stroke();
                                    ctx.restore();
                                });
                            });
                        }
                    }]
                };

                chartInstanceRef.current = new Chart(ctx, config);
            }
        }
    }, [data, windowSize]);

    if (!data) {
        return <div>Loading synapses density profile data...</div>;
    }

    return (
        <div>
            <div className="graph" style={{ height: '400px' }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, 'Synapses-Density-Profile-Data.json')}>
                    Synapses Density Profile Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesDensityProfileGraph;