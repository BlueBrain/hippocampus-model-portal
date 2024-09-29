import React, { useMemo, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { graphTheme } from '@/constants';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MeanFiringRatePlot = ({ plotData }) => {
    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: plotData?.name || 'Mean Firing Rate Distribution',
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label} Frequency: ${value}`;
                    },
                    title: (tooltipItems) => {
                        const item = tooltipItems[0];
                        const binStart = parseFloat(item.label);
                        const binEnd = binStart + binWidth;
                        return `${binStart.toFixed(1)} - ${binEnd.toFixed(1)} Hz`;
                    }
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Firing Rate (Hz)',
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                    callback: (value, index, values) => {
                        return parseFloat(value).toFixed(1);
                    }
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Frequency',
                },
                beginAtZero: true,
            },
        },
    }), [plotData?.name]);

    const { chartData, binWidth } = useMemo(() => {
        if (!plotData || !Array.isArray(plotData.values)) {
            return { chartData: null, binWidth: 0 };
        }

        const values = plotData.values.filter(v => v !== 0);
        const binCount = 10; // Reduced number of bins for clarity
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const binWidth = (maxVal - minVal) / binCount;

        const bins = Array.from({ length: binCount }, (_, i) => minVal + i * binWidth);
        const freq = Array(binCount).fill(0);

        values.forEach(v => {
            const index = Math.min(Math.floor((v - minVal) / binWidth), binCount - 1);
            freq[index]++;
        });

        return {
            chartData: {
                labels: bins.map(b => b.toFixed(1)),
                datasets: [{
                    data: freq,
                    backgroundColor: graphTheme.blue,
                    borderColor: graphTheme.blue,
                    borderWidth: 1,
                }],
            },
            binWidth: binWidth
        };
    }, [plotData]);

    const renderChart = useCallback(() => {
        if (!chartData) {
            return <p className="text-center text-gray-500">No data available.</p>;
        }
        return <Bar options={options} data={chartData} />;
    }, [chartData, options]);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            {renderChart()}
        </div>
    );
};

export default React.memo(MeanFiringRatePlot);