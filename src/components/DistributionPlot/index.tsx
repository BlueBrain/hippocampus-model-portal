import React, { useMemo, useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { graphTheme } from '@/constants';

ChartJS.register(LinearScale, BarElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: any;
    xAxis?: string;
    yAxis?: string;
    xAxisTickStep?: number;
}

const DistributionPlot: React.FC<PlotDetailsProps> = ({
    plotData,
    xAxis = 'Value',
    yAxis = 'Frequency',
    xAxisTickStep = 1,
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

    const formatScientificNotation = (value: number): string => {
        if (value === 0) return '0';
        const exponent = Math.floor(Math.log10(Math.abs(value)));
        const mantissa = value / Math.pow(10, exponent);
        const roundedMantissa = Math.round(mantissa * 100) / 100;
        const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
        const superscriptExponent = Math.abs(exponent)
            .toString()
            .split('')
            .map((digit) => superscriptDigits[parseInt(digit)])
            .join('');
        return `${roundedMantissa}*10${exponent < 0 ? '⁻' : ''}${superscriptExponent}`;
    };

    const { dataPoints, units, name, description } = useMemo(() => {
        if (!plotData) {
            console.error('Plot data is undefined or null');
            return { dataPoints: [], units: null, name: '', description: '' };
        }

        const createHistogram = (data: number[]) => {
            const binCount = Math.min(20, data.length);
            const min = Math.min(...data);
            const max = Math.max(...data);
            const binWidth = (max - min) / binCount;

            const bins = Array.from({ length: binCount + 1 }, (_, i) => min + i * binWidth);
            const counts = new Array(binCount).fill(0);

            data.forEach((value) => {
                const binIndex = Math.min(
                    Math.floor((value - min) / binWidth),
                    binCount - 1
                );
                counts[binIndex]++;
            });

            const dataPoints = counts.map((count, i) => ({
                x: bins[i],
                y: count,
            }));

            return { dataPoints };
        };

        if (Array.isArray(plotData)) {
            const { dataPoints } = createHistogram(plotData);
            return {
                dataPoints,
                units: null,
                name: '',
                description: '',
            };
        } else if (typeof plotData === 'object' && plotData !== null) {
            if ('freq' in plotData && 'bins' in plotData) {
                const dataPoints = plotData.bins.map((bin: number, index: number) => ({
                    x: bin,
                    y: plotData.freq[index],
                }));
                return {
                    dataPoints,
                    units: plotData.units,
                    name: plotData.name || '',
                    description: plotData.description || '',
                };
            } else if ('bins' in plotData && 'counts' in plotData) {
                const dataPoints = plotData.bins.map((bin: number, index: number) => ({
                    x: bin,
                    y: plotData.counts[index],
                }));
                return {
                    dataPoints,
                    units: null,
                    name: '',
                    description: '',
                };
            } else if ('values' in plotData && Array.isArray(plotData.values)) {
                const flatValues = plotData.values.flat();
                const { dataPoints } = createHistogram(flatValues);
                return {
                    dataPoints,
                    units: null,
                    name: '',
                    description: '',
                };
            } else {
                const dataPoints = Object.entries(plotData).map(([key, value]) => ({
                    x: parseFloat(key),
                    y: value,
                }));
                return {
                    dataPoints,
                    units: null,
                    name: '',
                    description: '',
                };
            }
        } else {
            console.error('Unexpected data format', plotData);
            return { dataPoints: [], units: null, name: '', description: '' };
        }
    }, [plotData]);

    const options: ChartOptions<'bar'> = useMemo(
        () => ({
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
                            const binStart = tooltipItems[0].parsed.x;
                            const binEnd = dataPoints[index + 1]
                                ? dataPoints[index + 1].x
                                : binStart;
                            return `${binStart} - ${binEnd} ${units || ''}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: 'linear' as const,
                    title: {
                        display: true,
                        text: xAxis,
                    },
                    ticks: {
                        stepSize: xAxisTickStep,
                        maxRotation: 0,
                        minRotation: 0,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yAxis,
                    },
                    ticks: {
                        callback: function (value) {
                            return formatScientificNotation(Number(value));
                        },
                    },
                },
            },
        }),
        [xAxisTickStep, xAxis, yAxis, dataPoints, units]
    );

    if (dataPoints.length === 0) {
        return <div>No data available for the plot.</div>;
    }

    const data = {
        datasets: [
            {
                label: 'Frequency',
                data: dataPoints,
                backgroundColor: graphTheme.blue,
                borderWidth: 0, // Removed borders
                barPercentage: 0.9, // Adjusted for spacing
                categoryPercentage: 0.9, // Adjusted for spacing
            },
        ],
    };

    return (
        <div>
            {name && <h2>{name}</h2>}
            {description && <p>{description}</p>}
            <div style={{ width: '100%', height: '400px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default DistributionPlot;