import React, { useEffect, useRef } from 'react';
import {
    Chart,
    BarController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    BarElement,
    Title,

} from 'chart.js';

import { graphTheme } from '@/constants';

import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';

Chart.register(
    BarController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    BarElement,
    Title
);

// Define the custom scale outside of the component
class CustomLogarithmicScale extends LogarithmicScale {
    static id = 'customLogarithmic';

    buildTicks() {
        const ticks: number[] = [];
        let power = Math.floor(Math.log10(this.min));
        const maxPower = Math.ceil(Math.log10(this.max));

        while (power <= maxPower) {
            ticks.push(Math.pow(10, power));
            power += 1;
        }

        return ticks.map(tick => ({ value: tick }));
    }
}

// Register the custom scale
Chart.register(CustomLogarithmicScale);

const formatScientificNotation = (value: number): string => {
    if (value === 0) return '0';
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    const roundedMantissa = Math.round(mantissa * 100) / 100;
    const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    const superscriptExponent = Math.abs(exponent).toString().split('').map(digit => superscriptDigits[parseInt(digit)]).join('');
    return `${roundedMantissa}×10${exponent < 0 ? '⁻' : ''}${superscriptExponent}`;
};

// Add this type declaration before the component
type CustomChartType = Chart & {
    scales: {
        y: CustomLogarithmicScale;
    };
};

export type SCDistibutionGraphProps = {
    data: any; // The JSON data to be visualized
    xAxisTitle?: string;
    yAxisTitle?: string;
    theme?: number;
    isLogarithmic?: boolean; // New prop to determine if y-axis should be logarithmic
    xTickInterval?: number; // New optional prop for tick interval on x-axis
};

const SCDistibutionGraph: React.FC<SCDistibutionGraphProps> = ({
    data,
    xAxisTitle,
    yAxisTitle,
    theme,
    isLogarithmic = false, // Default value is false
    xTickInterval, // New optional prop
}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null); // Ref to keep track of the chart instance

    const renderChart = () => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy(); // Destroy previous chart instance before re-rendering
                }

                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.bins.map((bin: number) => bin.toFixed(2)), // Bins for x-axis
                        datasets: [
                            {
                                label: data.name,
                                data: data.counts,
                                backgroundColor: graphTheme.blue,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                                title: {
                                    display: !!xAxisTitle,
                                    text: xAxisTitle || '',
                                },
                                ticks: {
                                    autoSkip: false, // Ensure no ticks are skipped if `xTickInterval` is provided
                                    callback: (value, index) => {
                                        // If xTickInterval is set, only show labels at specified intervals
                                        if (xTickInterval && index % xTickInterval !== 0) {
                                            return '';
                                        }
                                        return value;
                                    },
                                    maxRotation: 0, // Prevent slanted text
                                    minRotation: 0, // Prevent slanted text
                                    align: 'center', // Ensure numbers are centered and straight
                                },
                            },
                            y: {
                                type: isLogarithmic ? 'customLogarithmic' : 'linear',
                                title: {
                                    display: !!yAxisTitle,
                                    text: yAxisTitle || '',
                                },
                                min: 0,
                                ticks: {
                                    callback: function (value, index, values) {
                                        if (isLogarithmic) {
                                            return formatScientificNotation(Number(value));
                                        }
                                        return value;
                                    }
                                }
                            } as any, // Add type assertion here
                        },
                        plugins: {
                            title: {
                                display: false,
                                text: data.description,
                            },
                            tooltip: {
                                enabled: true,
                            },
                        },
                    },
                }) as CustomChartType; // Add type assertion here
            }
        }
    };

    useEffect(() => {
        renderChart();

        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [data, xAxisTitle, yAxisTitle, isLogarithmic, xTickInterval]); // Include xTickInterval in the dependency array

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `${data.name}.json`)}>
                    {data.name}
                </DownloadButton>
            </div>
        </div>
    );
};

export default SCDistibutionGraph;
