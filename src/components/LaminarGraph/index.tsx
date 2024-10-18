import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { graphTheme } from '@/constants';
import DownloadButton from '../DownloadButton';

Chart.register(...registerables);

const LaminarGraph = ({ data, height = 500, title, yAxisLabel, theme = 3 }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const getColor = useCallback((index) => {
        const colors = [graphTheme.blue, graphTheme.yellow, graphTheme.green, graphTheme.red, graphTheme.purple];
        return colors[index % colors.length];
    }, []);

    const datasets = useMemo(() => {
        if (!data || !data.value_map) return [];

        const layers = Object.keys(data.value_map);
        const cellTypes = Object.keys(data.value_map[layers[0]]);

        return layers.map((layer, index) => ({
            label: `${layer} (Model)`,
            data: cellTypes.map(cellType => (data.value_map[layer][cellType] || 0) * 100),
            backgroundColor: getColor(index),
            stack: 'Model',
        }));
    }, [data, getColor]);

    const hachurePlugin = {
        id: 'hachurePlugin',
        afterDatasetsDraw(chart, args, options) {
            const { ctx, data } = chart;
            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';

            data.datasets.forEach((dataset, datasetIndex) => {
                if (dataset.stack === 'Exp') {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    meta.data.forEach((bar, index) => {
                        if (dataset.data[index] > 0) {
                            const { x, y, width, height } = bar.getProps(['x', 'y', 'width', 'height']);
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(x - width / 2, y, width, height);
                            ctx.clip();
                            const lineSpacing = 4;
                            for (let i = -width; i < height + width; i += lineSpacing) {
                                ctx.moveTo(x - width / 2, y + i);
                                ctx.lineTo(x + width / 2, y + i - width);
                            }
                            ctx.stroke();
                            ctx.restore();
                        }
                    });
                }
            });
            ctx.restore();
        }
    };

    useEffect(() => {
        if (!chartRef.current || !data || !data.value_map) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return; // Ensure that ctx is not null

        const cellTypes = Object.keys(data.value_map[Object.keys(data.value_map)[0]]);

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cellTypes,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!title,
                        text: title || data.name,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                    legend: {
                        position: 'right',
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: yAxisLabel || data.unit || 'Percentage',
                        },
                    },
                },
            },
            plugins: [hachurePlugin],
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, datasets, title, yAxisLabel]);

    const downloadData = useCallback(() => {
        if (!data) return;
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `${data.id || 'laminar-data'}.json`;
        link.click();
    }, [data]);

    if (!data || !data.value_map) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <div style={{ height: `${height}px` }}>
                <canvas ref={chartRef} aria-label="Laminar Distribution Graph" role="img" />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={downloadData}>
                    Download Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default LaminarGraph;