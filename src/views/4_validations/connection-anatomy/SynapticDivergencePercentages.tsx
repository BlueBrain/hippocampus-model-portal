import React, { useEffect, useRef, useState } from 'react';
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
import DownloadButton from '@/components/DownloadButton';
import { graphTheme } from '@/constants';
import { dataPath } from '@/config';

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
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/connection-anatomy/synaptic-divergence-percentages.json')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    useEffect(() => {
        if (data && chartRef.current) {
            createChart();
        }
    }, [data]);

    const createChart = () => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
            const mtypes = Object.values(data.value_map.mtype);
            const spPcIndex = mtypes.indexOf('SP_PC');

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
                                    const angle = Math.PI / 4;

                                    for (let i = -width; i < height + width; i += lineSpacing) {
                                        const startX = x - width / 2;
                                        const startY = y + i;
                                        const endX = x + width / 2;
                                        const endY = startY - width;

                                        ctx.moveTo(startX, startY);
                                        ctx.lineTo(endX, endY);
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

            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: mtypes,
                    datasets: [
                        {
                            label: 'Model I-E',
                            data: mtypes.map((_, index) => data.value_map.model_PC[index]),
                            backgroundColor: mtypes.map((_, index) => index === spPcIndex ? graphTheme.red : graphTheme.blue),
                            stack: 'Model',
                        },
                        {
                            label: 'Model I-I',
                            data: mtypes.map((_, index) => data.value_map.model_INT[index]),
                            backgroundColor: mtypes.map((_, index) => index === spPcIndex ? graphTheme.green : graphTheme.purple),
                            stack: 'Model',
                        },
                        {
                            label: 'Exp E-E',
                            data: mtypes.map((_, index) => data.value_map.exp_PC[index] || 0),
                            backgroundColor: mtypes.map((_, index) => index === 6 ? graphTheme.red : graphTheme.blue),
                            stack: 'Exp',
                            borderWidth: 1,
                        },
                        {
                            label: 'Exp E-I',
                            data: mtypes.map((_, index) => data.value_map.exp_INT[index] || 0),
                            backgroundColor: mtypes.map((_, index) => index === 6 ? graphTheme.green : graphTheme.purple),
                            stack: 'Exp',
                            borderWidth: 1,
                        },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'mtype',
                                font: { size: 14 }
                            },
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Divergence (%)',
                                font: { size: 14 }
                            },
                            min: 0,
                            max: 100,
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'rect',
                                padding: 15,
                                font: { size: 12 },
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

            setChart(newChart);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chart) {
                chart.destroy();
            }
        };
    }, [chart]);

    return (
        <div>
            <div className="graph" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Synaptic-Divergence-Percentages-Data.json`)}>
                    Synaptic Divergence Percentages Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapticDivergencePercentagesGraph;