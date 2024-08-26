import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    LineController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
} from 'chart.js';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

import { dataPath } from '@/config';

Chart.register(
    ScatterController,
    LineController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    LineElement,
    Tooltip,
    Title
);

interface DataPoint {
    x: number;
    y: number;
}

interface SynapsesGraphData {
    dataPoints: DataPoint[];
    equation: string;
}

const calculateFormulaPoints = (): DataPoint[] => {
    const points: DataPoint[] = [];
    for (let x = 0.01; x <= 1000; x *= 1.1) {
        const ACh = x;
        const y = (1.0 * Math.pow(ACh, -0.576)) / (Math.pow(4.541, -0.576) + Math.pow(ACh, -0.576));
        points.push({ x: ACh, y });
    }
    return points;
};

const splitFormulaPoints = (points: DataPoint[]): { solidPoints: DataPoint[]; dottedPoints: DataPoint[] } => {
    const solidPoints: DataPoint[] = [];
    const dottedPoints: DataPoint[] = [];
    const splitPoint = 500;

    points.forEach(point => {
        if (point.x <= splitPoint) {
            solidPoints.push(point);
        } else {
            dottedPoints.push(point);
        }
    });

    return { solidPoints, dottedPoints };
};

export type SynapsesGraphProps = {
    theme?: number;
};

const SynapsesGraph: React.FC<SynapsesGraphProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [data, setData] = useState<SynapsesGraphData | null>(null);

    useEffect(() => {
        fetch(dataPath + '/2_reconstruction-data/acetylcholine/synapses-graph-data.json')
            .then((response) => response.json())
            .then((fetchedData) => {
                const synapsesGraphData: SynapsesGraphData = {
                    dataPoints: fetchedData.filter((item: any) => 'x' in item && 'y' in item),
                    equation: fetchedData.find((item: any) => 'equation' in item)?.equation || ''
                };
                setData(synapsesGraphData);
            });
    }, []);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const formulaPoints = calculateFormulaPoints();
                const { solidPoints, dottedPoints } = splitFormulaPoints(formulaPoints);

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [
                            {
                                label: 'Synapses Data',
                                data: data.dataPoints,
                                backgroundColor: '#3B4165',
                                pointRadius: 3
                            },
                            {
                                label: 'Formula Line (Solid)',
                                data: solidPoints,
                                type: 'line',
                                borderColor: '#3B4165',
                                borderWidth: 2,
                                fill: false,
                                showLine: true,
                                pointRadius: 0,
                                tension: 0.4
                            },
                            {
                                label: 'Formula Line (Dotted)',
                                data: dottedPoints,
                                type: 'line',
                                borderColor: '#3B4165',
                                borderWidth: 2,
                                fill: false,
                                showLine: true,
                                pointRadius: 0,
                                borderDash: [6, 6],
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'logarithmic',
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
                                    // drawBorder: true,
                                    drawOnChartArea: true,
                                },
                                ticks: {
                                    callback: function (value) {
                                        const logValue = Math.log10(value as number);
                                        if (logValue === -2 || logValue === -1 || logValue === 0 || logValue === 1 || logValue === 2 || logValue === 3) {
                                            return `10^${logValue.toFixed(0)}`;
                                        }
                                        return '';
                                    },
                                    autoSkip: false,
                                    maxTicksLimit: 6,
                                    color: '#050A30',
                                }
                            },
                            y: {
                                type: 'linear',
                                min: 0,
                                max: 1.2,
                                title: {
                                    display: true,
                                    text: 'Use scaling',
                                    color: '#050A30'
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    // drawBorder: true,
                                    drawOnChartArea: true,
                                },
                                ticks: {
                                    stepSize: 0.2,
                                    color: '#050A30'
                                }
                            }
                        }
                    }

                });
            }
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]);

    return (
        <div>
            <MathJaxContext>
                <MathJax>
                    {data ? `\\[${data.equation}\\]` : ''}
                </MathJax>
            </MathJaxContext>
            <div className="graph mb-4">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => data && downloadAsJson(data, `synapses-graph-data.json`)}>
                    Synapses Graph Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesGraph;