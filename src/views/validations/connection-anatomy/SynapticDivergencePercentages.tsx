import React, { useEffect, useRef } from 'react';
import {
    Chart,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title,
    Legend,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import SynapticDivergencePercentagesData from './synaptic-divergence-percentages.json';

Chart.register(
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title,
    Legend
);

export type SynapticDivergencePercentagesProps = {
    theme?: number;
};

const SynapticDivergencePercentagesGraph: React.FC<SynapticDivergencePercentagesProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const mtypes = Object.values(SynapticDivergencePercentagesData.value_map.mtype);

                const hachurePlugin = {
                    id: 'hachurePlugin',
                    afterDatasetsDraw(chart, args, options) {
                        const { ctx, data, chartArea: { top, bottom }, scales: { x, y } } = chart;

                        ctx.save();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'white';

                        data.datasets.forEach((dataset, datasetIndex) => {
                            if (dataset.stack === 'Exp') {
                                const meta = chart.getDatasetMeta(datasetIndex);
                                meta.data.forEach((bar, index) => {
                                    if (dataset.data[index] > 0) {
                                        const { x, y, width, height } = bar.getProps(['x', 'y', 'width', 'height']);

                                        // Draw hachure lines
                                        ctx.save();
                                        ctx.beginPath();
                                        ctx.rect(x - width / 2, y, width, bottom - y);
                                        ctx.clip();

                                        for (let i = y - width; i < bottom + width; i += 4) {
                                            ctx.moveTo(x - width / 2, i);
                                            ctx.lineTo(x + width / 2, i - width);
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

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: mtypes,
                        datasets: [
                            {
                                label: 'Model I-E',
                                data: mtypes.map((_, index) => SynapticDivergencePercentagesData.value_map.model_PC[index]),
                                backgroundColor: 'rgba(0, 0, 255, 0.7)',  // Blue
                                stack: 'Model',
                            },
                            {
                                label: 'Model I-I',
                                data: mtypes.map((_, index) => SynapticDivergencePercentagesData.value_map.model_INT[index]),
                                backgroundColor: 'rgba(128, 0, 128, 0.7)',  // Violet
                                stack: 'Model',
                            },
                            {
                                label: 'Exp E-E',
                                data: mtypes.map((_, index) => SynapticDivergencePercentagesData.value_map.exp_PC[index] || 0),
                                backgroundColor: 'rgba(255, 0, 0, 0.7)',  // Red
                                stack: 'Exp',
                                borderWidth: 1,
                            },
                            {
                                label: 'Exp E-I',
                                data: mtypes.map((_, index) => SynapticDivergencePercentagesData.value_map.exp_INT[index] || 0),
                                backgroundColor: 'rgba(0, 128, 0, 0.7)',  // Green
                                stack: 'Exp',
                                borderWidth: 1,
                            },
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'mtype',
                                    font: {
                                        size: 14,
                                    }
                                },
                            },
                            y: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Divergence (%)',
                                    font: {
                                        size: 14,
                                    }
                                },
                                min: 0,
                                max: 100,
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'rect',
                                    padding: 15,
                                    font: {
                                        size: 12,
                                    },
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const label = context.dataset.label;
                                        const value = context.parsed.y.toFixed(2);
                                        return `${label}: ${value}%`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [hachurePlugin],
                });
            }
        }
    }, [chartRef]);

    return (
        <div>
            <div className="graph">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(SynapticDivergencePercentagesData, `Synaptic-Divergence-Percentages-Data.json`)}>
                    Synaptic Divergence Percentages Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapticDivergencePercentagesGraph;