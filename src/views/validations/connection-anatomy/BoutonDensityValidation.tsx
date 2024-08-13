import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import BoutonDensityValidationData from './bouton-density-validation.json';
import { GraphTheme } from '@/types';
import { graphTheme } from '@/constants';

Chart.register(
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend
);

export type BoutonDensityValidationProps = {
    theme?: number;
};

const BoutonDensityValidationGraph: React.FC<BoutonDensityValidationProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Define the error bar plugin
                const errorBarPlugin = {
                    id: 'errorBar',
                    afterDatasetsDraw(chart: any, args: any, options: any) {
                        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

                        ctx.save();
                        data.datasets.forEach((dataset: any, datasetIndex: number) => {
                            if (dataset.label === 'Model') {
                                dataset.data.forEach((datapoint: any, index: number) => {
                                    if (datapoint.yMin !== undefined && datapoint.yMax !== undefined) {
                                        const xPos = x.getPixelForValue(datapoint.x);
                                        const yPos = y.getPixelForValue(datapoint.y);
                                        const yPosMin = y.getPixelForValue(datapoint.yMin);
                                        const yPosMax = y.getPixelForValue(datapoint.yMax);

                                        ctx.strokeStyle = dataset.borderColor;
                                        ctx.lineWidth = 2;

                                        // Draw vertical line
                                        ctx.beginPath();
                                        ctx.moveTo(xPos, yPosMin);
                                        ctx.lineTo(xPos, yPosMax);
                                        ctx.stroke();

                                        // Draw horizontal lines
                                        const horizontalLength = 5;
                                        ctx.beginPath();
                                        ctx.moveTo(xPos - horizontalLength, yPosMin);
                                        ctx.lineTo(xPos + horizontalLength, yPosMin);
                                        ctx.moveTo(xPos - horizontalLength, yPosMax);
                                        ctx.lineTo(xPos + horizontalLength, yPosMax);
                                        ctx.stroke();
                                    }
                                });
                            }
                        });
                        ctx.restore();
                    }
                };

                // Create the chart with the plugin included
                const chart = new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        labels: Object.values(BoutonDensityValidationData.value_map.mtype),
                        datasets: [
                            {
                                label: 'Model',
                                data: Object.values(BoutonDensityValidationData.value_map.mtype).map((_, index) => ({
                                    x: index,
                                    y: BoutonDensityValidationData.value_map.model_mean[index],
                                    yMin: BoutonDensityValidationData.value_map.model_mean[index] - BoutonDensityValidationData.value_map.model_std[index],
                                    yMax: BoutonDensityValidationData.value_map.model_mean[index] + BoutonDensityValidationData.value_map.model_std[index],
                                })),
                                backgroundColor: 'black',
                                borderColor: 'black',
                                pointStyle: 'circle',
                                pointRadius: 5,
                                showLine: false,
                            },
                            {
                                label: 'Experiment',
                                data: Object.values(BoutonDensityValidationData.value_map.mtype).map((_, index) => ({
                                    x: index,
                                    y: BoutonDensityValidationData.value_map.exp_mean[index],
                                })),
                                backgroundColor: graphTheme.red,
                                borderColor: graphTheme.red,
                                pointStyle: 'circle',
                                pointRadius: 5,
                                showLine: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                                title: {
                                    display: true,
                                    text: 'mtype',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'bouton density (um⁻¹)',
                                },
                                min: 0,
                                max: 0.5,
                            },
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                align: 'end',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    boxWidth: 6,
                                    boxHeight: 6,
                                    padding: 20,
                                    font: {
                                        size: 11,
                                        weight: 'normal',
                                    },
                                },
                                onClick: null, // Disable legend item click
                            },
                            title: {
                                display: false, // Remove the title
                            },
                            errorBar: {}, // Enable the error bar plugin
                        },
                    },
                    plugins: [errorBarPlugin], // Add the custom plugin here
                });
            }
        }
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