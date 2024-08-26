import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    CategoryScale,
    ChartData,
    ChartOptions,
    ScatterDataPoint,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { dataPath } from '@/config';
import { graphTheme } from '@/constants';

Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    CategoryScale
);

interface ConvergenceValidationData {
    name: string;
    data: [string, string, number, number, number, number][];
}

interface ConvergenceValidationProps {
    theme?: number;
    data: ConvergenceValidationData;
}

const errorBarPlugin = {
    id: 'errorBar',
    afterDatasetsDraw(chart: Chart, args: any, options: any) {
        const { ctx, data, chartArea: { left, right }, scales: { x, y } } = chart;

        ctx.save();
        data.datasets.forEach((dataset: any) => {
            dataset.data.forEach((datapoint: any) => {
                if (datapoint.yMin !== undefined && datapoint.yMax !== undefined) {
                    const xPos = x.getPixelForValue(datapoint.x);
                    const yMin = y.getPixelForValue(datapoint.yMin);
                    const yMax = y.getPixelForValue(datapoint.yMax);

                    ctx.strokeStyle = dataset.borderColor;
                    ctx.lineWidth = 2;

                    ctx.beginPath();
                    ctx.moveTo(xPos, yMin);
                    ctx.lineTo(xPos, yMax);
                    ctx.stroke();

                    const horizontalLength = 5;
                    ctx.beginPath();
                    ctx.moveTo(xPos - horizontalLength, yMin);
                    ctx.lineTo(xPos + horizontalLength, yMin);
                    ctx.moveTo(xPos - horizontalLength, yMax);
                    ctx.lineTo(xPos + horizontalLength, yMax);
                    ctx.stroke();
                }
            });
        });
        ctx.restore();
    }
};

const ConvergenceValidationGraph: React.FC<ConvergenceValidationProps> = ({ theme, data }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const uniqueRegions = Array.from(new Set(data.data.map(d => d[0])));

                const chartData: ChartData<'scatter'> = {
                    labels: uniqueRegions,
                    datasets: [
                        {
                            label: 'Inhibitory',
                            data: data.data.filter(d => d[1] === 'inh').map(d => ({
                                x: uniqueRegions.indexOf(d[0]),
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
                                x: uniqueRegions.indexOf(d[0]),
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
                                x: uniqueRegions.indexOf(d[0]),
                                y: d[2],
                                yMin: Math.max(0, d[2] - d[3]),
                                yMax: d[2] + d[3]
                            })),
                            backgroundColor: graphTheme.red,
                            borderColor: graphTheme.red,
                        }
                    ]
                };

                const maxValue = Math.max(
                    ...chartData.datasets.flatMap(dataset =>
                        dataset.data.map((d: ScatterDataPoint) => {
                            const point = d as ScatterDataPoint & { yMax?: number };
                            return Math.max(point.y as number, point.yMax || 0);
                        })
                    )
                );

                const chartOptions: ChartOptions<'scatter'> = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category' as const,
                            position: 'bottom' as const,
                            title: {
                                display: true,
                                text: 'Region'
                            },
                            ticks: {
                                padding: 10
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            type: 'linear' as const,
                            position: 'left' as const,
                            title: {
                                display: true,
                                text: 'Number of synapses'
                            },
                            min: 0,
                            max: maxValue * 1.1
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top' as const,
                            align: 'end' as const,
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 6,
                                boxHeight: 6
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: (context) => uniqueRegions[context[0].parsed.x as number]
                            }
                        }
                    }
                };

                const newChart = new Chart(ctx, {
                    type: 'scatter',
                    data: chartData,
                    options: chartOptions,
                    plugins: [errorBarPlugin]
                });

                setChart(newChart);
            }
        }
    };

    useEffect(() => {
        createChart();
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [data]);

    useEffect(() => {
        const handleResize = () => chart?.resize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [chart]);

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