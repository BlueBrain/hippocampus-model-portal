import React, { useEffect, useRef } from 'react';
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
import SynapsesGraphData from './synapses-graph-data.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

// Register necessary components
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

// Define the type for the data points
interface DataPoint {
    x: number;
    y: number;
}

const calculateFormulaPoints = (): DataPoint[] => {
    const points: DataPoint[] = [];
    for (let x = 0.01; x <= 1000; x *= 1.1) {
        // Increase the granularity of points
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

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const formulaPoints = calculateFormulaPoints();
                const { solidPoints, dottedPoints } = splitFormulaPoints(formulaPoints);

                new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [
                            {
                                label: 'Neurons Data',
                                data: [
                                    { x: 10, y: 0.38 },
                                    { x: 0.01, y: 1 },
                                    { x: 0.1, y: 0.96 },
                                    { x: 1, y: 0.81 },
                                    { x: 10, y: 0.74 },
                                    { x: 100, y: 0.47 },
                                    { x: 500, y: 0 },
                                    { x: 0.01, y: 1 },
                                    { x: 0.1, y: 0.98 },
                                    { x: 1, y: 0.67 },
                                    { x: 10, y: 0.43 },
                                    { x: 100, y: 0.13 },
                                    { x: 500, y: 0 },
                                    { x: 1, y: 1 },
                                    { x: 1, y: 0.89 },
                                    { x: 10, y: 0.77 },
                                    { x: 10, y: 0.66 },
                                    { x: 5, y: 0.3 },
                                    { x: 5, y: 0.27 },
                                    { x: 5, y: 0.06 },
                                    { x: 5, y: 0.32 },
                                    { x: 0.1, y: 0.96 },
                                    { x: 0.3, y: 0.83 },
                                    { x: 1, y: 0.6 },
                                    { x: 3, y: 0.3 },
                                    { x: 10, y: 0.06 },
                                    { x: 0, y: 1 }
                                ],
                                backgroundColor: '#3B4165', // Updated to desired color
                                pointRadius: 3
                            },
                            {
                                label: 'Formula Line (Solid)',
                                data: solidPoints,
                                type: 'line',
                                borderColor: '#3B4165', // Updated to desired color
                                borderWidth: 2,
                                fill: false,
                                showLine: true,
                                pointRadius: 0, // Make the points invisible
                                tension: 10 // Smooth the line to make it a curve
                            },
                            {
                                label: 'Formula Line (Dotted)',
                                data: dottedPoints,
                                type: 'line',
                                borderColor: '#3B4165', // Updated to desired color
                                borderWidth: 2,
                                fill: false,
                                showLine: true,
                                pointRadius: 0, // Make the points invisible
                                borderDash: [6, 6], // Make the line dotted
                                tension: 0.4 // Smooth the line to make it a curve
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            title: {
                                display: false,
                                text: '',
                                color: '#3B4165' // Title color
                            }
                        },
                        scales: {
                            x: {
                                type: 'logarithmic',
                                position: 'bottom',
                                min: 0.01,
                                max: 1000,
                                title: {
                                    display: true,
                                    text: 'ACh Concentration (µM)',
                                    color: '#050A30' // Axis title color
                                },
                                grid: {
                                    borderWidth: .1
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
                                    color: '#050A30', // Tick color
                                }
                            },
                            y: {
                                type: 'linear',
                                min: 0,
                                max: 1.2,
                                title: {
                                    display: true,
                                    text: 'Use scaling',
                                    color: '#050A30' // Axis title color
                                },
                                grid: {

                                },
                                ticks: {
                                    stepSize: 0.2,
                                    color: '#050A30' // Tick color
                                }
                            }
                        },
                        // Set background color for the chart

                        backgroundColor: '#313354', // Canvas background color
                    }
                });
            }
        }
    }, []);

    return (
        <div>
            <MathJaxContext>
                <MathJax>
                    {"\\[ U_{SE}^{ACh} = \\frac{1.0 \\cdot ACh^{-0.576}}{4.541^{-0.576} + ACh^{-0.576}} \\]"}
                </MathJax>
            </MathJaxContext>
            <div className="graph mb-4">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(SynapsesGraphData, `synapses-graph-data.json`)}>
                    Download Synapses Graph Data
                </DownloadButton>
            </div>
        </div>

    );
};

export default SynapsesGraph;