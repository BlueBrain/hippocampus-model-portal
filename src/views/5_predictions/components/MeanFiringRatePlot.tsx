import React, { useMemo } from 'react';
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

interface MeanFiringRatePlotProps {
    plotData: any;
    xAxis?: string;
    yAxis?: string;
    xAxisTickStep?: number;
}

const MeanFiringRatePlot: React.FC<MeanFiringRatePlotProps> = ({ plotData, xAxis, yAxis, xAxisTickStep }) => {
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
            tooltip: {
                callbacks: {
                    label: (context) => `Count: ${context.parsed.y}`,
                    title: (tooltipItems) => {
                        const value = parseFloat(tooltipItems[0].label);
                        return `${value.toFixed(6)} ${plotData?.units || 'Hz'}`;
                    }
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxis || 'Firing Rate (Hz)',
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                    callback: (value) => value,
                    stepSize: xAxisTickStep,
                },
            },
            y: {
                title: {
                    display: true,
                    text: yAxis || 'Count',
                },
                beginAtZero: true,
                ticks: {
                    maxTicksLimit: 10, // Limit the number of ticks to 5
                    precision: 0
                }
            },
        },
    }), [plotData, xAxis, yAxis, xAxisTickStep]);

    const chartData = useMemo(() => {
        if (!plotData || !Array.isArray(plotData.values)) {
            return null;
        }

        const values = plotData.values;
        const binCount = 10; // You can adjust this for more or fewer bins
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / binCount;

        const bins = Array(binCount).fill(0);
        values.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
            bins[binIndex]++;
        });

        return {
            labels: bins.map((_, index) => ((min + (index + 0.5) * binWidth).toFixed(2))),
            datasets: [{
                data: bins,
                backgroundColor: graphTheme.blue,
                borderColor: graphTheme.blue,
                borderWidth: 1,
            }],
        };
    }, [plotData]);

    if (!chartData) {
        return <p className="text-center text-gray-500">No data available.</p>;
    }

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default React.memo(MeanFiringRatePlot);
