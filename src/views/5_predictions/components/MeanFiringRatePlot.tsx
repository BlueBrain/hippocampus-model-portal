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
            tooltip: { enabled: false },
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Time (ms)',
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
        if (!plotData || !plotData.bins || !plotData.freq || plotData.bins.length === 0 || plotData.freq.length === 0) {
            return null;
        }

        const maxDataPoints = 1000;
        let bins = plotData.bins;
        let freq = plotData.freq;

        if (bins.length > maxDataPoints) {
            const skipFactor = Math.ceil(bins.length / maxDataPoints);
            bins = bins.filter((_, index) => index % skipFactor === 0);
            freq = freq.filter((_, index) => index % skipFactor === 0);
        }

        return {
            labels: bins,
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