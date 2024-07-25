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
import IfCurvePerETypeData from './if-curve-per-e-type-data.json';

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
    eType: string;
}

const NeuronsGraph: React.FC<NeuronsGraphProps> = ({ eType }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chartData = IfCurvePerETypeData[eType];
        if (!chartData) return;

        const labels = Object.keys(chartData);
        const meanValues = labels.map(label => chartData[label].mean);
        const errorValues = labels.map(label => {
            const variance = chartData[label].variance;
            const error = Math.sqrt(variance);
            return variance > 0 ? {
                yMin: chartData[label].mean - error,
                yMax: chartData[label].mean + error
            } : null;
        });

        // Calculate the maximum value considering the error bars
        const maxYValue = Math.max(...meanValues.map((mean, index) => {
            const errorValue = errorValues[index];
            return errorValue ? errorValue.yMax : mean;
        }));

        const data = {
            labels: labels.map(label => parseFloat(label)),
            datasets: [{
                label: 'Mean',
                data: labels.map((label, index) => ({ x: parseFloat(label), y: meanValues[index] })),
                borderColor: '#313354',
                borderWidth: 2,
                pointBackgroundColor: '#313354',
                showLine: true,
            }]
        };

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                const label = context.dataset.label || '';
                                const value = context.raw.y.toFixed(3); // Round to 3 decimal places
                                const originalLabel = labels[context.dataIndex]; // Use original labels array
                                const variance = chartData[originalLabel].variance;
                                return `${label}: ${value} (Variance: ${variance.toFixed(3)})`; // Round variance too
                            }
                        }
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Current (nA)'
                        },
                        position: 'bottom',
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Mean'
                        },
                        max: maxYValue * 1.1 // Add some padding above the maximum error bar
                    }
                }
            },
            plugins: [{
                id: 'customErrorBars',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.strokeStyle = '#313354';
                    ctx.lineWidth = 2;

                    chart.getDatasetMeta(0).data.forEach((point, index) => {
                        const { x, y } = point;
                        const errorValue = errorValues[index];
                        if (errorValue) {
                            const { yMin, yMax } = errorValue;
                            const yMinPixel = chart.scales.y.getPixelForValue(yMin);
                            const yMaxPixel = chart.scales.y.getPixelForValue(yMax);

                            // Draw the main line
                            ctx.beginPath();
                            ctx.moveTo(x, yMinPixel);
                            ctx.lineTo(x, yMaxPixel);
                            ctx.stroke();

                            // Draw the top cap
                            ctx.beginPath();
                            ctx.moveTo(x - 5, yMaxPixel);
                            ctx.lineTo(x + 5, yMaxPixel);
                            ctx.stroke();

                            // Draw the bottom cap
                            ctx.beginPath();
                            ctx.moveTo(x - 5, yMinPixel);
                            ctx.lineTo(x + 5, yMinPixel);
                            ctx.stroke();
                        }
                    });

                    ctx.restore();
                }
            }]
        });
    }, [eType]);

    return (
        <div>
            <canvas ref={chartRef} />
            <HttpDownloadButton onClick={() => downloadAsJson(IfCurvePerETypeData, `if-curve-per-e-type-data.json`)}>
                Download table data
            </HttpDownloadButton>
        </div>
    );
};

export default NeuronsGraph;