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
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { graphTheme } from '@/constants';
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

export type NbOfSynapsesPConnectionProps = {
    theme?: number;
};

const NbOfSynapsesPConnectionGraph: React.FC<NbOfSynapsesPConnectionProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        fetch(`${dataPath}/4_validations/connection-anatomy/nb-of-synapses-p-connection.json`)
            .then((response) => response.json())
            .then((data) => setChartData(data));
    }, []);

    const createChart = () => {
        if (chartRef.current && chartData) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Prepare data
                const dataPoints = Object.keys(chartData.value_map.exp_mean).map(key => ({
                    x: chartData.value_map.exp_mean[key],
                    y: chartData.value_map.model_mean[key],
                    xError: chartData.value_map.exp_std[key] || 0,
                    yError: chartData.value_map.model_std[key],
                }));

                // Custom plugin for error bars, diagonal line, and points
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
                        dataPoints.forEach((datapoint) => {
                            const xPixel = x.getPixelForValue(datapoint.x);
                            const yPixel = y.getPixelForValue(datapoint.y);

                            // X error bars
                            ctx.strokeStyle = graphTheme.red;
                            ctx.lineWidth = 2;
                            const xErrorPixels = Math.abs(x.getPixelForValue(datapoint.x + datapoint.xError) - x.getPixelForValue(datapoint.x));
                            ctx.beginPath();
                            ctx.moveTo(xPixel - xErrorPixels, yPixel);
                            ctx.lineTo(xPixel + xErrorPixels, yPixel);
                            ctx.stroke();

                            // Small vertical lines at the ends of X error bars
                            const smallLineLength = 3;
                            ctx.beginPath();
                            ctx.moveTo(xPixel - xErrorPixels, yPixel - smallLineLength);
                            ctx.lineTo(xPixel - xErrorPixels, yPixel + smallLineLength);
                            ctx.moveTo(xPixel + xErrorPixels, yPixel - smallLineLength);
                            ctx.lineTo(xPixel + xErrorPixels, yPixel + smallLineLength);
                            ctx.stroke();

                            // Y error bars
                            ctx.strokeStyle = 'black';
                            const yErrorPixels = Math.abs(y.getPixelForValue(datapoint.y + datapoint.yError) - y.getPixelForValue(datapoint.y));
                            ctx.beginPath();
                            ctx.moveTo(xPixel, yPixel - yErrorPixels);
                            ctx.lineTo(xPixel, yPixel + yErrorPixels);
                            ctx.stroke();

                            // Small horizontal lines at the ends of Y error bars
                            ctx.beginPath();
                            ctx.moveTo(xPixel - smallLineLength, yPixel - yErrorPixels);
                            ctx.lineTo(xPixel + smallLineLength, yPixel - yErrorPixels);
                            ctx.moveTo(xPixel - smallLineLength, yPixel + yErrorPixels);
                            ctx.lineTo(xPixel + smallLineLength, yPixel + yErrorPixels);
                            ctx.stroke();
                        });

                        ctx.restore();
                    }
                };

                const newChart = new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            data: dataPoints,
                            backgroundColor: 'black',
                            pointStyle: 'circle',
                            radius: 5,
                            borderColor: 'black',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: false,
                                    text: 'Synapses per connection Experiment'
                                },
                                min: 0,
                                max: 15,
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Synapses per connection Model',
                                },
                                min: 0,
                                max: 18,
                                ticks: {
                                    font: {
                                        size: 12,
                                    },
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const dataIndex = context.dataIndex;
                                        const pre = chartData.value_map.pre[dataIndex];
                                        const post = chartData.value_map.post[dataIndex];
                                        return `${pre} -> ${post}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [customPlugin]
                });

                setChart(newChart);
            }
        }
    };

    useEffect(() => {
        if (chartData) {
            createChart();
        }
    }, [chartData]);

    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chart) {
                chart.destroy();
            }
        };
    }, [chart]);

    return (
        <div>
            <div className="graph graph--rect" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(chartData, `Nb-Of-Synapses-Per-Connection-Data.json`)}>
                    Number Of Synapses Per Connection Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default NbOfSynapsesPConnectionGraph;