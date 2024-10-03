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
                                type: isLogarithmic ? 'logarithmic' : 'linear', // Conditionally set to logarithmic
                                title: {
                                    display: !!yAxisTitle,
                                    text: yAxisTitle || '',
                                },
                                min: 0,
                            },
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
                });
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