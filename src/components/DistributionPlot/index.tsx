import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: number[] | Record<string, any> | { bins: number[], counts: number[] };
    xAxis?: string;
    yAxis?: string;
}

const DistributionPlot: React.FC<PlotDetailsProps> = ({
    plotData,
    xAxis = 'Value',
    yAxis = 'Frequency',
}) => {
    const { labels, datasets } = useMemo(() => {
        const createHistogram = (data: number[]) => {
            const binCount = data.length;
            const min = Math.min(...data);
            const max = Math.max(...data);
            const binWidth = (max - min) / binCount;

            const bins = Array.from({ length: binCount }, (_, i) => min + i * binWidth);
            const counts = new Array(binCount).fill(0);

            data.forEach(value => {
                const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
                counts[binIndex]++;
            });

            return { bins, counts };
        };

        if (Array.isArray(plotData)) {
            // Handle raw data array
            const { bins, counts } = createHistogram(plotData);
            return {
                labels: bins.map(bin => bin.toFixed(2)),
                datasets: [{
                    label: 'Frequency',
                    data: counts,
                    backgroundColor: '#050A30',
                    borderColor: '#050A30',
                    borderWidth: 1,
                }]
            };
        } else if (typeof plotData === 'object') {
            if ('bins' in plotData && 'counts' in plotData) {
                // Handle pre-computed histogram data
                return {
                    labels: plotData.bins.map((bin: number) => bin.toFixed(2)),
                    datasets: [{
                        label: 'Frequency',
                        data: plotData.counts,
                        backgroundColor: '#050A30',
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }]
                };
            } else if ('values' in plotData && Array.isArray(plotData.values)) {
                // Handle nested 'values' array
                const flatValues = plotData.values.flat();
                const { bins, counts } = createHistogram(flatValues);
                return {
                    labels: bins.map(bin => bin.toFixed(2)),
                    datasets: [{
                        label: 'Frequency',
                        data: counts,
                        backgroundColor: '#050A30',
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }]
                };
            } else {
                // Handle object data directly
                const entries = Object.entries(plotData);
                return {
                    labels: entries.map(([key, _]) => key),
                    datasets: [{
                        label: 'Value',
                        data: entries.map(([_, value]) => value),
                        backgroundColor: '#050A30',
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }]
                };
            }
        } else {
            // Handle unexpected data format
            console.error('Unexpected data format');
            return { labels: [], datasets: [] };
        }
    }, [plotData]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxis,
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    callback: function (value: number, index: number, ticks: any[]) {
                        if (index % Math.ceil(ticks.length / 10) === 0) {
                            return this.getLabelForValue(value);
                        }
                        return '';
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: yAxis,
                },
            },
        },
    };

    return <Bar data={{ labels, datasets }} options={options} />;
};

export default DistributionPlot;