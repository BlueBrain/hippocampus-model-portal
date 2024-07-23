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
import IfCurvePerCellData from './if-curve-per-cell-data.json';

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
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        showLine: true,
                        fill: false,
                        tension: 0.1,
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
                                const raw = context.raw as DataPoint;
                                return [
                                    `Amplitude: ${raw.x}`,
                                    `Mean Frequency: ${raw.y}`
                                ];
                            }
                        },
                    },
                },
            },
        });
    }, [instance]);

    return (
        <div>
            {instance}
            <canvas ref={chartRef} />
            <HttpDownloadButton onClick={() => downloadAsJson(IfCurvePerCellData, `if-curve-per-cell-data.json`)}>
                Download table data
            </HttpDownloadButton>
        </div>
    );
};

export default NeuronsGraph;