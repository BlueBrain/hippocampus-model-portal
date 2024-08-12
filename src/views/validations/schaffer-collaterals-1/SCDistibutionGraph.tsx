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

import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

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
};

const SCDistibutionGraph: React.FC<SCDistibutionGraphProps> = ({
    data,
    xAxisTitle,
    yAxisTitle,
    theme,
    isLogarithmic = false, // Default value is false
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
                                backgroundColor: 'black',
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
            renderChart(); // Re-render the chart on window resize
        };

        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [data, xAxisTitle, yAxisTitle, isLogarithmic]); // Include isLogarithmic in the dependency array

    return (
        <div>
            <div className="graph no-margin no-padding">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `${data.name}.json`)}>
                    Download {data.name}
                </DownloadButton>
            </div>
        </div>
    );
};

export default SCDistibutionGraph;