import React, { useEffect, useRef } from 'react';
import {
    Chart,
    LineController,
    BarController,
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
import DivergenceValidationData from './divergence-validation.json';
import { graphTheme } from '@/constants';

Chart.register(
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend
);

export type DivergenceValidationProps = {
    theme?: number;
};

const DivergenceValidationGraph: React.FC<DivergenceValidationProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const modelData = Object.keys(DivergenceValidationData.value_map.mtype).map(key => ({
                    x: DivergenceValidationData.value_map.mtype[key],
                    y: DivergenceValidationData.value_map.model_mean[key],
                    yMin: DivergenceValidationData.value_map.model_mean[key] - DivergenceValidationData.value_map.model_std[key],
                    yMax: DivergenceValidationData.value_map.model_mean[key] + DivergenceValidationData.value_map.model_std[key],
                }));

                const experimentData = Object.keys(DivergenceValidationData.value_map.mtype).map(key => ({
                    x: DivergenceValidationData.value_map.mtype[key],
                    y: DivergenceValidationData.value_map.exp_mean[key],
                    yMin: DivergenceValidationData.value_map.exp_mean[key] - (DivergenceValidationData.value_map.exp_std[key] || 0),
                    yMax: DivergenceValidationData.value_map.exp_mean[key] + (DivergenceValidationData.value_map.exp_std[key] || 0),
                })).filter(d => d.y !== null);

                const customPlugin = {
                    id: 'customPlugin',
                    afterDraw: (chart) => {
                        const { ctx, scales: { x, y } } = chart;
                        ctx.save();
                        ctx.lineWidth = 2;

                        // Draw error bars for model data
                        modelData.forEach((point, index) => {
                            const xPixel = x.getPixelForValue(point.x);
                            const yPixel = y.getPixelForValue(point.y);
                            const yMinPixel = y.getPixelForValue(point.yMin);
                            const yMaxPixel = y.getPixelForValue(point.yMax);

                            ctx.strokeStyle = 'black';
                            ctx.beginPath();
                            ctx.moveTo(xPixel, yMinPixel);
                            ctx.lineTo(xPixel, yMaxPixel);
                            ctx.stroke();

                            // Horizontal caps
                            const capLength = 5;
                            ctx.beginPath();
                            ctx.moveTo(xPixel - capLength, yMinPixel);
                            ctx.lineTo(xPixel + capLength, yMinPixel);
                            ctx.moveTo(xPixel - capLength, yMaxPixel);
                            ctx.lineTo(xPixel + capLength, yMaxPixel);
                            ctx.stroke();
                        });

                        // Draw error bars for experiment data
                        experimentData.forEach((point, index) => {
                            const xPixel = x.getPixelForValue(point.x);
                            const yPixel = y.getPixelForValue(point.y);
                            const yMinPixel = y.getPixelForValue(point.yMin);
                            const yMaxPixel = y.getPixelForValue(point.yMax);

                            ctx.strokeStyle = graphTheme.red;
                            ctx.beginPath();
                            ctx.moveTo(xPixel, yMinPixel);
                            ctx.lineTo(xPixel, yMaxPixel);
                            ctx.stroke();

                            // Horizontal caps
                            const capLength = 5;
                            ctx.beginPath();
                            ctx.moveTo(xPixel - capLength, yMinPixel);
                            ctx.lineTo(xPixel + capLength, yMinPixel);
                            ctx.moveTo(xPixel - capLength, yMaxPixel);
                            ctx.lineTo(xPixel + capLength, yMaxPixel);
                            ctx.stroke();
                        });

                        ctx.restore();
                    }
                };

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Object.values(DivergenceValidationData.value_map.mtype),
                        datasets: [
                            {
                                type: 'scatter',
                                label: 'Model',
                                data: modelData,
                                backgroundColor: 'black',
                                pointStyle: 'circle',
                                radius: 5,
                                borderColor: 'black',
                                borderWidth: 1,
                            },
                            {
                                type: 'scatter',
                                label: 'Experiment',
                                data: experimentData,
                                backgroundColor: graphTheme.red,
                                pointStyle: 'circle',
                                radius: 5,
                                borderColor: graphTheme.red,
                                borderWidth: 1,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'mtype',

                                },
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Divergence (synapses)',

                                },
                                min: 0,
                                max: 25000,
                            }
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

                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const label = context.dataset.label;
                                        const value = context.parsed.y.toFixed(2);
                                        return `${label}: ${value}`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [customPlugin]
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
                <DownloadButton theme={theme} onClick={() => downloadAsJson(DivergenceValidationData, `Divergence-Validation-Data.json`)}>
                    Divergence Validation Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default DivergenceValidationGraph;