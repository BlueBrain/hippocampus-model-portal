import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    LineController,
    LogarithmicScale,
    PointElement,
    LineElement,
    Tooltip,
    ChartConfiguration
} from 'chart.js';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { dataPath } from '@/config';

Chart.register(
    ScatterController,
    CategoryScale,
    LinearScale,
    LineController,
    LogarithmicScale,
    PointElement,
    LineElement,
    Tooltip,
);

interface DataPoint {
    x: number;
    y: number;
}

interface NeuronGraphData {
    dataPoints: DataPoint[];
    equation: string;
}

const calculateY = (x: number): number => {
    const ACH = x;
    const numerator = 0.567 * Math.pow(ACH, 0.436);
    const denominator = Math.pow(100, 0.436) + Math.pow(ACH, 0.436);
    return numerator / denominator;
};

const generateLineData = (): DataPoint[] => {
    const lineData: DataPoint[] = [];
    for (let i = 0.01; i <= 1000; i *= 1.1) {
        lineData.push({ x: i, y: calculateY(i) });
    }
    return lineData;
};

const splitLineData = (data: DataPoint[]): { solidData: DataPoint[], dottedData: DataPoint[] } => {
    const solidData: DataPoint[] = [];
    const dottedData: DataPoint[] = [];
    const splitPoint = 100;

    data.forEach(point => {
        if (point.x <= splitPoint) {
            solidData.push(point);
        } else {
            dottedData.push(point);
        }
    });

    return { solidData, dottedData };
};

export type NeuronsGraphProps = {
    theme?: number;
};

const NeuronsGraph: React.FC<NeuronsGraphProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [data, setData] = useState<NeuronGraphData | null>(null);

    useEffect(() => {
        fetch(dataPath + '/2_reconstruction-data/acetylcholine/neuron-graph-data.json')
            .then((response) => response.json())
            .then((fetchedData) => {
                const neuronGraphData: NeuronGraphData = {
                    dataPoints: fetchedData.filter((item: any) => 'x' in item && 'y' in item),
                    equation: fetchedData.find((item: any) => 'equation' in item)?.equation || ''
                };
                setData(neuronGraphData);
            });
    }, []);

    const createChart = () => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const lineData = generateLineData();
                const { solidData, dottedData } = splitLineData(lineData);

                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const chartConfig: ChartConfiguration = {
                    type: 'scatter',
                    data: {
                        datasets: [
                            {
                                label: 'Neurons Data',
                                data: data.dataPoints,
                                backgroundColor: '#3B4165',
                                pointRadius: 3
                            },
                            {
                                label: 'Fit',
                                data: solidData,
                                borderColor: '#3B4165',
                                type: 'line',
                                fill: false,
                                pointRadius: 0,
                                borderWidth: 2,
                                tension: 0
                            },
                            {
                                label: 'Experimental data',
                                data: dottedData,
                                borderColor: '#3B4165',
                                type: 'line',
                                fill: false,
                                pointRadius: 0,
                                borderWidth: 2,
                                borderDash: [6, 6],
                                tension: 0
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: { duration: 0 },
                        scales: {
                            x: {
                                type: 'logarithmic' as const,
                                position: 'bottom',
                                min: 0.01,
                                max: 1000,
                                title: {
                                    display: true,
                                    text: 'ACh Concentration (µM)',
                                    color: '#050A30'
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    drawOnChartArea: true,
                                },
                                ticks: {
                                    callback: function (value) {
                                        const logValue = Math.log10(value as number);
                                        switch (logValue) {
                                            case -2: return '10⁻²';
                                            case -1: return '10⁻¹';
                                            case 0: return '10';
                                            case 1: return '10¹';
                                            case 2: return '10²';
                                            case 3: return '10³';
                                            default: return '';
                                        }
                                    },
                                    autoSkip: false,
                                    maxTicksLimit: 6,
                                    color: '#050A30'
                                }
                            },
                            y: {
                                type: 'linear',
                                min: 0,
                                max: 0.4,
                                title: {
                                    display: true,
                                    text: 'Current (nA)',
                                    color: '#050A30'
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    drawOnChartArea: true,
                                },
                                ticks: {
                                    color: '#050A30'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: false,
                                text: '',
                                color: '#050A30'
                            }
                        },
                        backgroundColor: 'white',
                    }
                };

                chartInstanceRef.current = new Chart(ctx, chartConfig);
            }
        }
    };

    useEffect(() => {
        if (data) {
            createChart();

            const handleResize = () => {
                createChart();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }
            };
        }
    }, [data]);

    return (
        <div>
            <MathJaxContext>
                <MathJax>
                    {data ? `\\[${data.equation}\\]` : ''}
                </MathJax>
            </MathJaxContext>
            <div className="graph" style={{ height: '400px' }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => data && downloadAsJson(data, `neuron-graph-data.json`)}>
                    Neuron
                </DownloadButton>
            </div>
        </div>
    );
};

export default NeuronsGraph;