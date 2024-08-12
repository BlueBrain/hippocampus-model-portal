import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    Tooltip,
    Title,
    Legend,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import pspAmplitudeData from './psp-amplitude.json';

Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    Tooltip,
    Title,
    Legend
);

type PSPAmplitudeData = {
    name: string;
    description: string;
    units: string;
    value_map: {
        pathway: { [key: string]: string };
        post: { [key: string]: string };
        exp_mean: { [key: string]: number };
        model_mean: { [key: string]: number };
        exp_std: { [key: string]: number | string };
        model_std: { [key: string]: number };
        connection_class: { [key: string]: string };
        pre: { [key: string]: string };
    };
};

type PSPAmplitudeProps = {
    theme?: number;
};

const PSPAmplitude: React.FC<PSPAmplitudeProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const data: PSPAmplitudeData = pspAmplitudeData;

    useEffect(() => {
        if (chartRef.current && data && data.value_map) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Prepare data
                const chartData = Object.keys(data.value_map.exp_mean).map(key => ({
                    x: data.value_map.exp_mean[key],
                    y: data.value_map.model_mean[key],
                    xError: data.value_map.exp_std[key] === "None" ? 0 : Number(data.value_map.exp_std[key]),
                    yError: data.value_map.model_std[key],
                    connectionClass: data.value_map.connection_class[key],
                }));

                // Custom plugin for error bars and diagonal line
                const customPlugin = {
                    id: 'customPlugin',
                    beforeDatasetsDraw(chart, args, options) {
                        const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

                        ctx.save();

                        // Draw diagonal line
                        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
                        ctx.setLineDash([5, 5]);
                        ctx.beginPath();
                        ctx.moveTo(left, bottom);
                        ctx.lineTo(right, top);
                        ctx.stroke();

                        // Draw error bars
                        ctx.setLineDash([]);
                        chartData.forEach((datapoint) => {
                            const xPixel = x.getPixelForValue(datapoint.x);
                            const yPixel = y.getPixelForValue(datapoint.y);

                            // X error bars
                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = 2;
                            const xErrorPixels = Math.abs(x.getPixelForValue(datapoint.x + datapoint.xError) - x.getPixelForValue(datapoint.x));
                            ctx.beginPath();
                            ctx.moveTo(xPixel - xErrorPixels, yPixel);
                            ctx.lineTo(xPixel + xErrorPixels, yPixel);
                            ctx.stroke();

                            // Y error bars
                            ctx.strokeStyle = 'black';
                            const yErrorPixels = Math.abs(y.getPixelForValue(datapoint.y + datapoint.yError) - y.getPixelForValue(datapoint.y));
                            ctx.beginPath();
                            ctx.moveTo(xPixel, yPixel - yErrorPixels);
                            ctx.lineTo(xPixel, yPixel + yErrorPixels);
                            ctx.stroke();
                        });

                        ctx.restore();
                    }
                };

                new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            data: chartData,
                            backgroundColor: (context) => {
                                const connectionClass = chartData[context.dataIndex].connectionClass;
                                switch (connectionClass) {
                                    case 'E-E': return 'red';
                                    case 'E-I': return 'green';
                                    case 'I-E': return 'blue';
                                    case 'I-I': return 'purple';
                                    default: return 'black';
                                }
                            },
                            pointStyle: 'circle',
                            radius: 5,
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        aspectRatio: 1,
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: `PSP amplitude (${data.units}) Experiment`
                                },
                                min: 0,
                                max: 3.0,
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: `PSP amplitude (${data.units}) Model`,
                                },
                                min: 0,
                                max: 3.0,
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                align: 'end',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    generateLabels: (chart) => {
                                        return ['E-E', 'E-I', 'I-E', 'I-I'].map(label => ({
                                            text: label,
                                            fillStyle: label === 'E-E' ? 'red' :
                                                label === 'E-I' ? 'green' :
                                                    label === 'I-E' ? 'blue' : 'purple',
                                            strokeStyle: 'black',

                                            hidden: false,
                                            index: null
                                        }));
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const dataIndex = context.dataIndex;
                                        const pathway = data.value_map.pathway[dataIndex];
                                        return `${pathway}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
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

    if (!data || !data.value_map) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <div className="graph graph--rect">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `PSP-Amplitude-Data.json`)}>
                    PSP Amplitude Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default PSPAmplitude;