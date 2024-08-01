import React, { useEffect, useRef } from 'react';
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
} from 'chart.js';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';
import NeuronGraphData from './neuron-graph-data.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

// Register necessary components
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

// Define the type for the data points
interface DataPoint {
    x: number;
    y: number;
}

// Function to calculate y-values based on the formula
const calculateY = (x: number): number => {
    const ACH = x;
    const numerator = 0.567 * Math.pow(ACH, 0.436);
    const denominator = Math.pow(100, 0.436) + Math.pow(ACH, 0.436);
    return numerator / denominator;
};

// Generate data points for the formula line
const generateLineData = (): DataPoint[] => {
    const lineData: DataPoint[] = [];
    for (let i = 0.01; i <= 1000; i *= 1.1) {
        lineData.push({ x: i, y: calculateY(i) });
    }
    return lineData;
};

// Split the line data into solid and dotted segments
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

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const lineData = generateLineData();
                const { solidData, dottedData } = splitLineData(lineData);

                new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [
                            {
                                label: 'Neurons Data',
                                data: [
                                    { x: 10.0, y: 0.12 },
                                    { x: 5.0, y: 0.17 },
                                    { x: 5.0, y: 0.07 },
                                    { x: 5.0, y: 0.13 },
                                    { x: 10.0, y: 0.37 },
                                    { x: 3.0, y: 0.16 },
                                    { x: 10.0, y: 0.17 },
                                    { x: 1.0, y: 0.09 },
                                    { x: 50.0, y: 0.23 },
                                    { x: 100.0, y: 0.3 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 0.0, y: 0.0 },
                                    { x: 10.0, y: 0.02 },
                                    { x: 10.0, y: 0.12 },
                                    { x: 3.0, y: 0.06 },
                                    { x: 10.0, y: 0.07 }
                                ],
                                backgroundColor: '#3B4165', // Updated to desired color from the first graph
                                pointRadius: 3 // Updated to match the first graph
                            },
                            {
                                label: 'Formula Line (Solid)',
                                data: solidData,
                                borderColor: '#3B4165', // Updated to desired color from the first graph
                                type: 'line',
                                fill: false,
                                pointRadius: 0,
                                borderWidth: 2, // Updated to match the first graph
                                tension: 10// Added to make the line a curve
                            },
                            {
                                label: 'Formula Line (Dotted)',
                                data: dottedData,
                                borderColor: '#3B4165', // Updated to desired color from the first graph
                                type: 'line',
                                fill: false,
                                pointRadius: 0,
                                borderWidth: 2, // Updated to match the first graph
                                borderDash: [6, 6],
                                tension: 0.4 // Added to make the line a curve
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
                                    color: '#050A30' // Updated axis title color
                                },
                                grid: {
                                    color: 'EA9088', // Grid line color
                                    borderWidth: .1
                                },
                                ticks: {
                                    callback: function (value) {
                                        const logValue = Math.log10(value as number);
                                        if (logValue === -2 || logValue === -1 || logValue === 0 || logValue === 1 || logValue === 2 || logValue === 3) {
                                            return `10 ^ ${logValue.toFixed(0)}`;
                                        }
                                        return '';
                                    },
                                    autoSkip: false,
                                    maxTicksLimit: 6,
                                    color: '#050A30' // Updated tick color
                                }
                            },
                            y: {
                                type: 'linear',
                                min: 0,
                                max: 0.4,
                                title: {
                                    display: true,
                                    text: 'Current (nA)',
                                    color: '#050A30' // Updated axis title color
                                },
                                grid: {
                                    color: '#050A30', // Grid line color
                                    borderWidth: .1
                                },
                                ticks: {
                                    stepSize: 0.1,
                                    color: '#050A30' // Updated tick color
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: false,
                                text: '',
                                color: '#050A30' // Title color
                            }
                        },
                        // Set background color for the chart
                        backgroundColor: 'white', // Canvas background color
                    }
                });
            }
        }
    }, []);

    return (
        <>
            <div className='graph'>
                <canvas ref={chartRef} />

            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(NeuronGraphData, `neuron-graph-data.json`)}>
                    Download Neuron Graph Data
                </DownloadButton>
            </div>

        </>
    );
};

export default NeuronsGraph;