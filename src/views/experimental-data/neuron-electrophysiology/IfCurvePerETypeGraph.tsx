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
        const errorValues = labels.map(label => ({
            min: chartData[label].mean - Math.sqrt(chartData[label].variance),
            max: chartData[label].mean + Math.sqrt(chartData[label].variance)
        }));

        const data = {
            labels,
            datasets: [{
                label: 'Mean',
                data: meanValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                showLine: true,
                errorBar: {
                    data: errorValues,
                    width: 1
                }
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
                        type: 'linear',
                        position: 'bottom',
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
            }
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