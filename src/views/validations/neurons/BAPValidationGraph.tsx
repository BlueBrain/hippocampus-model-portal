import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import bAPValidationData from './bap-validation.json';

Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const BAPValidationGraph = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            const modelData = bAPValidationData.values[0].value_map;
            const expData = bAPValidationData.values[1].value_map;

            const randomOffset = () => Math.random() * 30 - 15;

            const modelDataset = Object.keys(modelData.distance).map(key => ({
                x: modelData.distance[key] + randomOffset(),
                y: modelData.model_mean[key],
                yMin: modelData.model_mean[key] - modelData.model_std[key],
                yMax: modelData.model_mean[key] + modelData.model_std[key],
            }));

            const expDataset = Object.keys(expData.distance).map(key => ({
                x: expData.distance[key],
                y: expData.exp_mean[key],
                yMin: expData.exp_mean[key] - expData.model_mean[key],
                yMax: expData.exp_mean[key] + expData.model_mean[key],
            }));

            const newChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Model',
                            data: modelDataset,
                            backgroundColor: 'black',
                            borderColor: 'black',
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 7,
                            order: 2,
                        },
                        {
                            label: 'Experiment',
                            data: expDataset,
                            backgroundColor: 'red',
                            borderColor: 'red',
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 7,
                            order: 1,
                        }
                    ]
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
                                text: 'Distance from soma (µm)',
                            },
                            min: 0,
                            max: 400,
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'bAP amplitude (mV)',
                            },
                            min: 0,
                            max: 100,
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
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y.toFixed(2);
                                    return `${label}: ${value} mV`;
                                }
                            }
                        }
                    }
                },
                plugins: [{
                    id: 'errorBars',
                    afterDatasetsDraw(chart, args, options) {
                        const { ctx, data, scales: { x, y } } = chart;

                        data.datasets.forEach((dataset, i) => {
                            const meta = chart.getDatasetMeta(i);

                            if (!meta.hidden) {
                                meta.data.forEach((element, index) => {
                                    const { x: xPos } = element.tooltipPosition();

                                    const dataPoint = dataset.data[index] as { yMin: number, yMax: number };
                                    const yTop = y.getPixelForValue(dataPoint.yMax);
                                    const yBottom = y.getPixelForValue(dataPoint.yMin);

                                    ctx.save();
                                    ctx.strokeStyle = dataset.borderColor as string;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(xPos, yBottom);
                                    ctx.lineTo(xPos, yTop);
                                    ctx.stroke();

                                    ctx.restore();
                                });
                            }
                        });
                    }
                }]
            });

            setChartInstance(newChart);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Set initial size
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (windowSize.width > 0 && windowSize.height > 0) {
            if (chartInstance) {
                chartInstance.destroy();
            }
            createChart();
        }
    }, [windowSize]);

    return (
        <>
            <div className="graph" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(bAPValidationData, `bAP-Validation-Data.json`)}>
                    bAP Validation Data
                </DownloadButton>
            </div>
        </>
    );
};

export default BAPValidationGraph;