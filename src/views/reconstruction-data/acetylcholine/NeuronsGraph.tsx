import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    Tooltip,
} from 'chart.js';

// Register necessary components
Chart.register(
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    Tooltip,
);

const NeuronsGraph: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            label: 'Neurons Data',
                            data: [
                                { x: 10.0, y: 0.12 },
                                { x: 5.0, y: 0.17 },
                                { x: 5.0, y: 0.07 },
                                { x: 5.0, y: 0.13 },
                                { x: 10.0, y: 0.37 }
                            ],
                            backgroundColor: 'rgba(3, 20, 55, 1)',
                            pointRadius: 8
                        }]
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