import React, { useMemo, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { graphTheme } from '@/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: any;
    xAxis?: string;
    yAxis?: string;
    xAxisTickStep?: number; // New prop for x-axis tick step
}

const DistributionPlot: React.FC<PlotDetailsProps> = ({
    plotData,
    xAxis = 'Value',
    yAxis = 'Frequency',
    xAxisTickStep,
}) => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    const { labels, datasets, units, name, description } = useMemo(() => {
        if (!plotData) {
            console.error('Plot data is undefined or null');
            return { labels: [], datasets: [], units: null, name: '', description: '' };
        }

        const createHistogram = (data: number[]) => {
            const binCount = Math.min(20, data.length);
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
                    backgroundColor: graphTheme.blue,
                    borderColor: '#050A30',
                    borderWidth: 1,
                }],
                units: null,
                name: '',
                description: ''
            };
        } else if (typeof plotData === 'object' && plotData !== null) {
            if ('freq' in plotData && 'bins' in plotData) {
                // Handle new data structure
                return {
                    labels: plotData.bins,
                    datasets: [{
                        label: plotData.name || 'Frequency',
                        data: plotData.freq,
                        backgroundColor: graphTheme.blue,
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }],
                    units: plotData.units,
                    name: plotData.name || '',
                    description: plotData.description || ''
                };
            } else if ('bins' in plotData && 'counts' in plotData) {
                // Handle pre-computed histogram data
                return {
                    labels: plotData.bins.map((bin: number) => bin.toFixed(2)),
                    datasets: [{
                        label: 'Frequency',
                        data: plotData.counts,
                        backgroundColor: graphTheme.blue,
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }],
                    units: null,
                    name: '',
                    description: ''
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
                        backgroundColor: graphTheme.blue,
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }],
                    units: null,
                    name: '',
                    description: ''
                };
            } else {
                // Handle object data directly
                const entries = Object.entries(plotData);
                return {
                    labels: entries.map(([key, _]) => key),
                    datasets: [{
                        label: 'Value',
                        data: entries.map(([_, value]) => value),
                        backgroundColor: graphTheme.blue,
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }],
                    units: null,
                    name: '',
                    description: ''
                };
            }
        } else {
            console.error('Unexpected data format', plotData);
            return { labels: [], datasets: [], units: null, name: '', description: '' };
        }
    }, [plotData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any) => {
                        const index = tooltipItems[0].dataIndex;
                        if (Array.isArray(labels)) {
                            const binStart = labels[index];
                            const binEnd = labels[index + 1] || (parseFloat(binStart) + (parseFloat(labels[1]) - parseFloat(labels[0]))).toFixed(2);
                            return `${binStart} - ${binEnd} ${units || ''}`;
                        }
                        return labels[index];
                    }
                }
            }
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
                        if (xAxisTickStep) {
                            // Use the provided xAxisTickStep
                            if (index % xAxisTickStep === 0) {
                                return this.getLabelForValue(value);
                            }
                        } else {
                            // Use the default adaptive tick step based on window width
                            if (index % Math.ceil(ticks.length / (windowWidth < 600 ? 5 : 10)) === 0) {
                                return this.getLabelForValue(value);
                            }
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

    if (labels.length === 0 || datasets.length === 0) {
        return <div>No data available for the plot.</div>;
    }

    return (
        <div>
            {name && <h2>{name}</h2>}
            {description && <p>{description}</p>}
            <div style={{ width: '100%', height: '400px' }}>
                <Bar data={{ labels, datasets }} options={options} />
            </div>
        </div>
    );
};

export default DistributionPlot;