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

// Function to calculate y-values based on the formula
const calculateY = (x) => {
    const ACH = x;
    const numerator = 0.567 * Math.pow(ACH, 0.436);
    const denominator = Math.pow(100, 0.436) + Math.pow(ACH, 0.436);
    return numerator / denominator;
};

// Generate data points for the formula line
const generateLineData = () => {
    const lineData = [];
    for (let i = 0.01; i <= 1000; i *= 1.1) {
        lineData.push({ x: i, y: calculateY(i) });
    }
    return lineData;
};

const NeuronsGraph: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
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
                                backgroundColor: 'rgba(3, 20, 55, 1)',
                                pointRadius: 8
                            },
                            {
                                label: 'Formula Line',
                                data: generateLineData(),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                type: 'line',
                                fill: false,
                                pointRadius: 0,
                                borderWidth: 2
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
                                ticks: {
                                    callback: function (value) {
                                        const logValue = Math.log10(value);
                                        if (logValue === -2 || logValue === -1 || logValue === 0 || logValue === 1 || logValue === 2 || logValue === 3) {
                                            return `10 ^ ${logValue.toFixed(0)}`;
                                        }
                                        return '';
                                    },
                                    autoSkip: false,
                                    maxTicksLimit: 6
                                }
                            },
                            y: {
                                type: 'linear',
                                min: 0,
                                max: 0.4,
                                ticks: {
                                    stepSize: 0.1
                                }
                            }
                        }
                    }
                });
            }
        }
    }, []);

    return (
        <div>
            <canvas ref={chartRef} />
        </div>
    );
};

export default NeuronsGraph;
