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
} from 'chart.js';

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
);

const calculateFormulaPoints = () => {
    const points = [];
    for (let x = 0.01; x <= 1000; x *= 1.1) { // Increase the granularity of points
        const ACh = x;
        const y = (1.0 * Math.pow(ACh, -0.576)) / (Math.pow(4.541, -0.576) + Math.pow(ACh, -0.576));
        points.push({ x: ACh, y: y });
    }
    return points;
};

const splitFormulaPoints = (points) => {
    const solidPoints = [];
    const dottedPoints = [];
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

const SynapsesGraph: React.FC = () => {
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
                                backgroundColor: 'rgba(3, 20, 55, 1)',
                                pointRadius: 5
                            },
                            {
                                label: 'Formula Line (Solid)',
                                data: solidPoints,
                                type: 'line',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 2,
                                fill: false,
                                showLine: true,
                                pointRadius: 0, // Make the points invisible
                                tension: 0.4 // Smooth the line to make it a curve
                            },
                            {
                                label: 'Formula Line (Dotted)',
                                data: dottedPoints,
                                type: 'line',
                                borderColor: 'rgba(255, 99, 132, 1)',
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
                                            return `10^${logValue.toFixed(0)}`;
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
                                max: 1.2,
                                ticks: {
                                    stepSize: 0.2
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

export default SynapsesGraph;