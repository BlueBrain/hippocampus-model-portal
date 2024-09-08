import React, { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    Plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CrosshairPlugin from 'chartjs-plugin-crosshair';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    CrosshairPlugin as unknown as Plugin
);

interface TraceDataProps {
    plotData?: {
        name: string;
        description: string;
        units: string | null;
        value_map: number[][];
    };
}

// Extend the ChartOptions type to include the crosshair plugin options
interface ExtendedChartOptions extends ChartOptions<'line'> {
    plugins: {
        crosshair?: {
            line?: {
                color?: string;
                width?: number;
            };
            sync?: {
                enabled?: boolean;
            };
            zoom?: {
                enabled?: boolean;
            };
        };
    };
}

const ChartJSTraceGraph: React.FC<TraceDataProps> = ({ plotData }) => {
    const [chartData, setChartData] = useState<ChartData<'line'>>({ datasets: [] });
    const [options, setOptions] = useState<ExtendedChartOptions>({});
    const chartRef = useRef<ChartJS>(null);

    useEffect(() => {
        if (!plotData || plotData.value_map.length === 0) {
            console.log('No plot data available');
            return;
        }

        const datasets = plotData.value_map.map((trace, index) => ({
            label: `Trace ${index + 1}`,
            data: trace,
            borderColor: `hsl(${index * 137.5 % 360}, 70%, 50%)`,
            pointRadius: 0,
            borderWidth: 1,
        }));

        const labels = Array.from({ length: plotData.value_map[0].length }, (_, i) => i.toString());

        setChartData({
            labels,
            datasets,
        });

        setOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: plotData.name || 'Trace Data',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(10);
                            }
                            return label;
                        }
                    }
                },
                crosshair: {
                    line: {
                        color: '#F66',
                        width: 1
                    },
                    sync: {
                        enabled: true,
                    },
                    zoom: {
                        enabled: true,
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: plotData.units || 'Value',
                    },
                    ticks: {
                        callback: function (value) {
                            return (typeof value === 'number' ? value.toFixed(10) : value);
                        }
                    }
                },
            },
        });
    }, [plotData]);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default ChartJSTraceGraph;