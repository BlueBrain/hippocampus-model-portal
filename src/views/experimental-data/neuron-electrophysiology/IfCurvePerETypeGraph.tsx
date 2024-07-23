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
            return {
                yMin: chartData[label].mean - error,
                yMax: chartData[label].mean + error
            };
        });

        const data = {
            labels,
            datasets: [{
                label: 'Mean',
                data: meanValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
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
                    },
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Mean'
                        }
                    }
                }
            },
            plugins: [{
                id: 'customErrorBars',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
                    ctx.lineWidth = 1;

                    chart.getDatasetMeta(0).data.forEach((point, index) => {
                        const { x, y } = point;
                        const { yMin, yMax } = errorValues[index];
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
                    });

                    ctx.restore();
                }
            }]
        });
    }, [eType]);

    return (
        <div>
            {eType}
            <canvas ref={chartRef} />
            <HttpDownloadButton onClick={() => downloadAsJson(IfCurvePerETypeData, `if-curve-per-e-type-data.json`)}>
                Download table data
            </HttpDownloadButton>
        </div>
    );
};

export default NeuronsGraph;