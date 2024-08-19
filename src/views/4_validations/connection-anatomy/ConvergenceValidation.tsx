import React, { useEffect, useRef, useState } from 'react';
import { Chart, ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend, CategoryScale } from 'chart.js';
import { downloadAsJson } from '@/utils';
import { GraphTheme } from '@/types';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { graphTheme } from '@/constants';

Chart.register(ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend, CategoryScale);

const errorBarPlugin = {
    id: 'errorBar',
    afterDatasetsDraw(chart, args, options) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

        ctx.save();
        data.datasets.forEach((dataset, i) => {
            dataset.data.forEach((datapoint, index) => {
                if (datapoint.yMin !== undefined && datapoint.yMax !== undefined) {
                    const xScale = x.getPixelForValue(datapoint.x);
                    const yScale = y.getPixelForValue(datapoint.y);
                    const yScaleMin = y.getPixelForValue(datapoint.yMin);
                    const yScaleMax = y.getPixelForValue(datapoint.yMax);

                    // Adjust x position for potential offset
                    const xPos = Math.max(left, Math.min(xScale, right));

                    ctx.strokeStyle = dataset.borderColor;
                    ctx.lineWidth = 2;

                    // Draw vertical line
                    ctx.beginPath();
                    ctx.moveTo(xPos, yScaleMin);
                    ctx.lineTo(xPos, yScaleMax);
                    ctx.stroke();

                    // Draw horizontal lines
                    const horizontalLength = 5;
                    ctx.beginPath();
                    ctx.moveTo(xPos - horizontalLength, yScaleMin);
                    ctx.lineTo(xPos + horizontalLength, yScaleMin);
                    ctx.moveTo(xPos - horizontalLength, yScaleMax);
                    ctx.lineTo(xPos + horizontalLength, yScaleMax);
                    ctx.stroke();
                }
            });
        });
        ctx.restore();
    }
};

const ConvergenceValidationGraph = ({ theme, data }) => {
    const chartRef = useRef(null);
    const [chart, setChart] = useState(null);

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            const newChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Inhibitory',
                            data: data.data.filter(d => d[1] === 'inh').map(d => ({
                                x: d[0],
                                y: d[4],
                                yMin: Math.max(0, d[4] - d[5]),
                                yMax: d[4] + d[5]
                            })),
                            backgroundColor: graphTheme.blue,
                            borderColor: graphTheme.blue,
                        },
                        {
                            label: 'Excitatory',
                            data: data.data.filter(d => d[1] === 'exc').map(d => ({
                                x: d[0],
                                y: d[4],
                                yMin: Math.max(0, d[4] - d[5]),
                                yMax: d[4] + d[5]
                            })),
                            backgroundColor: graphTheme.green,
                            borderColor: graphTheme.green,
                        },
                        {
                            label: 'Experimental',
                            data: data.data.map(d => ({
                                x: d[0],
                                y: d[2],
                                yMin: Math.max(0, d[2] - d[3]),
                                yMax: d[2] + d[3]
                            })),
                            backgroundColor: graphTheme.red,
                            borderColor: graphTheme.red,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Region'
                            },
                            offset: true,
                            ticks: {
                                padding: 10
                            },
                            grid: {
                                display: false,
                                offset: true
                            }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Number of synapses'
                            },
                            min: 0,
                            suggestedMax: (context) => {
                                const maxValue = context.chart.data.datasets.reduce((max, dataset) => {
                                    const datasetMax = Math.max(...dataset.data.map(d => d.yMax || d.y));
                                    return datasetMax > max ? datasetMax : max;
                                }, 0);
                                return maxValue * 1.1;
                            }
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
                                boxWidth: 6,
                                boxHeight: 6
                            }
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    }
                },
                plugins: [errorBarPlugin],
            });

            setChart(newChart);
        }
    };

    useEffect(() => {
        createChart();

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
    }, [data]);

    return (
        <div className="w-full">
            <div className="graph no-margin" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, data.name)}>
                    Convergence Validation Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default ConvergenceValidationGraph;