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
                display: true,
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
                    text: xAxis || `Firing Rate (${plotData?.units || 'Hz'})`,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                    callback: (value) => parseFloat(value).toFixed(3),
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
                    stepSize: 1,
                    precision: 0
                }
            },
        },
    }), [plotData, xAxis, yAxis, xAxisTickStep]);

    const chartData = useMemo(() => {
        if (!plotData || !Array.isArray(plotData.values)) {
            return null;
        }

        const binWidth = 0.001; // Adjust this value to change the histogram resolution
        const bins = {};
        plotData.values.forEach(value => {
            const binIndex = Math.floor(value / binWidth);
            bins[binIndex] = (bins[binIndex] || 0) + 1;
        });

        const sortedBins = Object.entries(bins).sort(([a], [b]) => parseFloat(a) - parseFloat(b));

        return {
            labels: sortedBins.map(([bin]) => (parseFloat(bin) * binWidth).toFixed(3)),
            datasets: [{
                data: sortedBins.map(([, count]) => count),
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
