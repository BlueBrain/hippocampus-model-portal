import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { GraphTheme } from '@/types';
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
    Legend
);

export type ConnectionProbabilityProps = {
    theme?: number;
};

interface ConnectionProbabilityData {
    value_map: {
        exp_mean: { [key: string]: number };
        model_mean: { [key: string]: number };
        connection_class: { [key: string]: string };
    };
}

const ConnectionProbabilityGraph: React.FC<ConnectionProbabilityProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<ConnectionProbabilityData | null>(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/connection-anatomy/connection-probability.json')
            .then((response) => response.json())
            .then((fetchedData: ConnectionProbabilityData) => setData(fetchedData));
    }, []);

    const createChart = () => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Prepare rawChartData
                const rawChartData = Object.keys(data.value_map.exp_mean).map(key => ({
                    x: data.value_map.exp_mean[key],
                    y: data.value_map.model_mean[key],
                    connectionClass: data.value_map.connection_class[key]
                }));

                // Define custom plugin for diagonal line
                const customPlugin = {
                    id: 'customPlugin',
                    afterDraw: (chart: Chart) => {
                        const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

                        // Draw diagonal line
                        ctx.save();
                        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
                        ctx.setLineDash([5, 5]);
                        ctx.beginPath();
                        ctx.moveTo(left, bottom);
                        ctx.lineTo(right, top);
                        ctx.stroke();
                        ctx.restore();
                    }
                };

                const chartData: ChartData<'scatter'> = {
                    datasets: [
                        {
                            label: 'EE',
                            data: rawChartData.filter(d => d.connectionClass === 'EE'),
                            backgroundColor: graphTheme.red,
                            pointStyle: 'circle',
                            //radius: 6,
                        },
                        {
                            label: 'EI',
                            data: rawChartData.filter(d => d.connectionClass === 'EI'),
                            backgroundColor: graphTheme.green,
                            pointStyle: 'circle',
                            //radius: 6,
                        },
                        {
                            label: 'IE',
                            data: rawChartData.filter(d => d.connectionClass === 'IE'),
                            backgroundColor: graphTheme.blue,
                            pointStyle: 'circle',
                            // radius: 6,
                        },
                        {
                            label: 'II',
                            data: rawChartData.filter(d => d.connectionClass === 'II'),
                            backgroundColor: graphTheme.purple,
                            pointStyle: 'circle',
                            // radius: 6,
                        }
                    ]
                };

                const chartOptions: ChartOptions<'scatter'> = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Connection probability Experiment',
                            },
                            min: 0,
                            max: 0.5,
                            ticks: {
                                color: 'black',
                                font: {
                                    size: 12,
                                },
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Connection probability Model',
                            },
                            min: 0,
                            max: 0.5,
                            ticks: {
                                font: {
                                    size: 12,
                                },
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
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
                                padding: 15,
                                font: {
                                    size: 12,
                                },
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `${context.dataset.label}: (${context.parsed.x.toFixed(3)}, ${context.parsed.y.toFixed(3)})`;
                                }
                            }
                        }
                    }
                };

                const newChart = new Chart(ctx, {
                    type: 'scatter',
                    data: chartData,
                    options: chartOptions,
                    plugins: [customPlugin]
                });

                setChart(newChart);
            }
        }
    };

    useEffect(() => {
        if (data) {
            createChart();
        }

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

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="graph graph--rect" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Connection-Probability-Data.json`)}>
                    Connection Probability Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default ConnectionProbabilityGraph;