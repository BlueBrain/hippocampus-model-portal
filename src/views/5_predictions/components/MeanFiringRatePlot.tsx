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
                display: false,
                text: plotData?.name || 'Mean Firing Rate Distribution',
            },
            tooltip: { enabled: true },
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
                    maxTicksLimit: 20,
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

    const chartData = useMemo(() => {
        if (!plotData) {
            return null;
        }

        let bins, freq;

        if (plotData.bins && plotData.freq) {
            // Original data format
            bins = plotData.bins;
            freq = plotData.freq;
        } else if (Array.isArray(plotData.values)) {
            // New data format (both current and shared)
            const values = plotData.values.filter(v => v !== 0);
            const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);
            const binWidth = (maxVal - minVal) / binCount;

            bins = Array.from({ length: binCount }, (_, i) => minVal + i * binWidth);
            freq = Array(binCount).fill(0);

            values.forEach(v => {
                const index = Math.min(Math.floor((v - minVal) / binWidth), binCount - 1);
                freq[index]++;
            });
        } else {
            return null;
        }

        const maxDataPoints = 1000;
        if (bins.length > maxDataPoints) {
            const skipFactor = Math.ceil(bins.length / maxDataPoints);
            bins = bins.filter((_, index) => index % skipFactor === 0);
            freq = freq.filter((_, index) => index % skipFactor === 0);
        }

        return {
            labels: bins.map(b => b.toFixed(4)),
            datasets: [
                {
                    data: freq,
                    backgroundColor: graphTheme.blue,
                    borderColor: graphTheme.blue,
                    borderWidth: 1,
                },
            ],
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