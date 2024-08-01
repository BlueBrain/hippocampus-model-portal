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
import { downloadAsJson } from '@/utils';
import IfCurvePerCellData from './if-curve-per-cell-data.json';
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

interface NeuronsGraphProps {
    instance: string;
}

interface DataPoint {
    x: number;
    y: number;
}

const NeuronsGraph: React.FC<NeuronsGraphProps> = ({ instance }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas) return;

        // Filter the JSON data based on the instance
        const filteredData = Object.entries(IfCurvePerCellData)
            .filter(([key]) => key.startsWith(instance))
            .flatMap(([_, steps]) =>
                Object.values(steps).map((step: any) => ({
                    x: step.amplitude,
                    y: step.mean_frequency,
                }))
            );

        // Calculate the maximum x value
        const maxXValue = filteredData.reduce((max, point) => Math.max(max, point.x), 0);

        // Destroy previous chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart(canvas, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'IF Curve per Cell',
                        data: filteredData,
                        borderColor: '#031437',
                        borderWidth: 2,
                        backgroundColor: '#031437',
                        showLine: true,
                        fill: false,
                        tension: 0,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Amplitude (Na)',
                        },
                        max: maxXValue, // Set the max value for the x axis
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Mean Frequency (Hz)',
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            title: function () {
                                return '';
                            },
                            label: function (context) {
                                const raw = context.raw as DataPoint; // Type assertion
                                return [
                                    `Amplitude: ${raw.x.toFixed(3)}`, // Round to 3 decimal places
                                    `Mean Frequency: ${raw.y.toFixed(3)}` // Round to 3 decimal places
                                ];
                            }
                        },
                    },
                },
            },
        });
    }, [instance]);

    return (
        <>
            <div className='graph'>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(IfCurvePerCellData, `if-curve-per-cell-data.json`)}>
                    Download table data
                </DownloadButton>
            </div>
        </>
    );
};

export default NeuronsGraph;