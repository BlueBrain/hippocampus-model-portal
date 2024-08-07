import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Title,
} from 'chart.js';
import BAPData from './bAP.json'; // Ensure this path is correct
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

// Register necessary components
Chart.register(
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Title
);

// Custom plugin for error bars
const errorBarPlugin = {
    id: 'errorBarPlugin',
    afterDraw: (chart) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset) => {
            const meta = chart.getDatasetMeta(dataset.index);
            meta.data.forEach((point, index) => {
                const { x, y } = point.getProps(['x', 'y']);
                const { yMin, yMax } = dataset.data[index];

                // Draw error bars
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = dataset.borderColor;
                ctx.beginPath();
                ctx.moveTo(x, yMin);
                ctx.lineTo(x, yMax);
                ctx.stroke();
                ctx.restore();
            });
        });
    },
};

Chart.register(errorBarPlugin);

export type SynapsesGraphProps = {
    theme?: number;
};

const SynapsesGraph: React.FC<SynapsesGraphProps> = ({ theme }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            // Convert objects to arrays, ensuring the data is defined
            const distances = Object.values(BAPData.values[0]?.value_map.distance || {});
            const modelMeans = Object.values(BAPData.values[0]?.value_map.model_mean || {});
            const modelStds = Object.values(BAPData.values[0]?.value_map.model_std || {});

            const expDistances = Object.values(BAPData.values[1]?.value_map.distance || {});
            const expMeans = Object.values(BAPData.values[1]?.value_map.exp_mean || {});
            const expModelMeans = Object.values(BAPData.values[1]?.value_map.model_mean || {});

            // Check if all required arrays have the same length
            const isValidData = (
                distances.length === modelMeans.length &&
                modelMeans.length === modelStds.length &&
                expDistances.length === expMeans.length &&
                expMeans.length === expModelMeans.length
            );

            if (!isValidData) {
                console.error("Data arrays have mismatched lengths.");
                return;
            }

            // Prepare data with error bars
            const chartData = {
                datasets: [
                    {
                        label: 'Model',
                        data: distances.map((distance, index) => ({
                            x: distance,
                            y: modelMeans[index],
                            yMin: modelMeans[index] - modelStds[index],
                            yMax: modelMeans[index] + modelStds[index],
                        })),
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 4,
                        pointHoverRadius: 5,
                        showLine: false,
                    },
                    {
                        label: 'Experiment',
                        data: expDistances.map((distance, index) => ({
                            x: distance,
                            y: expMeans[index],
                            yMin: expMeans[index] - expModelMeans[index],
                            yMax: expMeans[index] + expModelMeans[index],
                        })),
                        backgroundColor: 'red',
                        borderColor: 'red',
                        pointRadius: 4,
                        pointHoverRadius: 5,
                        showLine: false,
                    }
                ]
            };

            const chartOptions = {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Distance from soma (µm)',
                        },
                        ticks: {
                            stepSize: 50,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'bAP amplitude (mV)',
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += Math.round(context.raw.y * 100) / 100;
                                return label;
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: 'Expected plot for bAP attenuation',
                    },
                },
            };

            new Chart(chartRef.current, {
                type: 'scatter',
                data: chartData,
                options: chartOptions,
            });
        }
    }, [chartRef]);

    return (
        <div>
            <div className="graph mb-4">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(BAPData, `bAP-data.json`)}>
                    bAP Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesGraph;
