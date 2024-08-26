import React, { useEffect, useRef, useState } from 'react';
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

import { graphTheme } from '@/constants';
import { dataPath } from '@/config';

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
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/connection-anatomy/divergence-validation.json')
            .then((response) => response.json())
            .then((fetchedData) => {
                setData(fetchedData);
            });
    }, []);

    useEffect(() => {
        if (data && chartRef.current) {
            createChart();
        }
    }, [data]);

    const createChart = () => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const modelData = Object.keys(data.value_map.mtype).map(key => ({
            x: data.value_map.mtype[key],
            y: data.value_map.model_mean[key],
            yMin: data.value_map.model_mean[key] - data.value_map.model_std[key],
            yMax: data.value_map.model_mean[key] + data.value_map.model_std[key],
        }));

        const experimentData = Object.keys(data.value_map.mtype).map(key => ({
            x: data.value_map.mtype[key],
            y: data.value_map.exp_mean[key],
            yMin: data.value_map.exp_mean[key] - (data.value_map.exp_std[key] || 0),
            yMax: data.value_map.exp_mean[key] + (data.value_map.exp_std[key] || 0),
        })).filter(d => d.y !== null);

        const customPlugin = {
            id: 'customPlugin',
            afterDraw: (chart) => {
                const { ctx, scales: { x, y } } = chart;
                ctx.save();
                ctx.lineWidth = 2;

                // Draw error bars for model data
                modelData.forEach((point) => {
                    const xPixel = x.getPixelForValue(point.x);
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
                experimentData.forEach((point) => {
                    const xPixel = x.getPixelForValue(point.x);
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

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.values(data.value_map.mtype),
                datasets: [
                    {
                        type: 'scatter',
                        label: 'Model',
                        data: modelData,
                        backgroundColor: 'black',
                        pointStyle: 'circle',
                        //radius: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                    },
                    {
                        type: 'scatter',
                        label: 'Experiment',
                        data: experimentData,
                        backgroundColor: graphTheme.red,
                        pointStyle: 'circle',
                        //radius: 5,
                        borderColor: graphTheme.red,
                        borderWidth: 1,
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

        setChart(newChart);
    };

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
            <div className="graph" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            {data && (
                <div className="mt-4">
                    <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Divergence-Validation-Data.json`)}>
                        Divergence Validation Data
                    </DownloadButton>
                </div>
            )}
        </div>
    );
};

export default DivergenceValidationGraph;