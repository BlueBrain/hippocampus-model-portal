import React, { useMemo, useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { graphTheme } from '@/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: number[] | Record<string, number> | {
        freq: number[],
        bins: number[],
        name?: string,
        description?: string,
        units?: string
    };
    xAxis?: string;
    yAxis?: string;
    xAxisTickStep?: number;
}

interface ProcessedPlotData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
    units: string | null;
    name: string;
    description: string;
}

const DistributionPlot: React.FC<PlotDetailsProps> = ({
    plotData,
    xAxis = 'Value',
    yAxis = 'Frequency',
    xAxisTickStep,
}) => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const processedData = useMemo<ProcessedPlotData>(() => {
        if (!plotData) {
            console.error('Plot data is undefined or null');
            return { labels: [], datasets: [], units: null, name: '', description: '' };
        }

        const createHistogram = (data: number[], binCount = 20) => {
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
                return {
                    labels: plotData.bins.map(String),
                    datasets: [{
                        label: plotData.name || 'Frequency',
                        data: plotData.freq,
                        backgroundColor: graphTheme.blue,
                        borderColor: '#050A30',
                        borderWidth: 1,
                    }],
                    units: plotData.units || null,
                    name: plotData.name || '',
                    description: plotData.description || ''
                };
            } else {
                const entries = Object.entries(plotData);
                return {
                    labels: entries.map(([key, _]) => key),
                    datasets: [{
                        label: 'Value',
                        data: entries.map(([_, value]) => value as number),
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

    const formatScientificNotation = (value: number): string => {
        if (value === 0) return '0';
        const exponent = Math.floor(Math.log10(Math.abs(value)));
        const mantissa = value / Math.pow(10, exponent);
        const roundedMantissa = Math.round(mantissa * 100) / 100;
        const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
        const superscriptExponent = Math.abs(exponent).toString().split('').map(digit => superscriptDigits[parseInt(digit)]).join('');
        return `${roundedMantissa}*10${exponent < 0 ? '⁻' : ''}${superscriptExponent}`;
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex;
                        const binStart = processedData.labels[index];
                        const binEnd = processedData.labels[index + 1] ||
                            (parseFloat(binStart) + (parseFloat(processedData.labels[1]) - parseFloat(processedData.labels[0]))).toFixed(2);
                        return `${binStart} - ${binEnd} ${processedData.units || ''}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: xAxis },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    callback: (value, index, ticks) => {
                        const numericValue = parseFloat(value.toString());
                        if (!isNaN(numericValue)) {
                            if (xAxisTickStep) {
                                const epsilon = 0.0001;
                                const remainder = numericValue % xAxisTickStep;
                                if (Math.abs(remainder) < epsilon || Math.abs(remainder - xAxisTickStep) < epsilon) {
                                    return value;
                                }
                            } else if (index % Math.ceil(ticks.length / (windowWidth < 600 ? 5 : 10)) === 0) {
                                return value;
                            }
                        }
                        return '';
                    },
                },
            },
            y: {
                title: { display: true, text: yAxis },
                ticks: {
                    callback: (value) => {
                        const numericValue = Number(value);
                        const threshold = 1e3;
                        if (Math.abs(numericValue) >= threshold || (numericValue !== 0 && Math.abs(numericValue) <= 1 / threshold)) {
                            return formatScientificNotation(numericValue);
                        }
                        return numericValue.toLocaleString();
                    },
                },
            },
        },
    };

    if (processedData.labels.length === 0 || processedData.datasets.length === 0) {
        return <div>No data available for the plot.</div>;
    }

    const chartData: ChartData<'bar'> = {
        labels: processedData.labels,
        datasets: processedData.datasets
    };

    return (
        <div>
            {processedData.name && <h2>{processedData.name}</h2>}
            {processedData.description && <p>{processedData.description}</p>}
            <div style={{ width: '100%', height: '400px' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default DistributionPlot;