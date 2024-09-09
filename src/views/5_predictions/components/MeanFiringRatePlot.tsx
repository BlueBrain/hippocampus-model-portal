import React from 'react';
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
    const options = {
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
    };

    const chartData = {
        labels: plotData?.bins || [],
        datasets: [
            {
                data: plotData?.freq || [],
                backgroundColor: graphTheme.blue,
                borderColor: graphTheme.blue,
                borderWidth: 1,
            },
        ],
    };

    if (!plotData || !plotData.bins || !plotData.freq || plotData.bins.length === 0 || plotData.freq.length === 0) {
        return <p className="text-center text-gray-500">No data available.</p>;
    }

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default MeanFiringRatePlot;