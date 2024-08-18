import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, ChartDataset, registerables } from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import synapsesPerConnectionData from './synapses-per-conections.json';

Chart.register(...registerables);

interface SynapsesPerConnectionProps {
    theme?: number;
}

const SynapsesPerConnection: React.FC<SynapsesPerConnectionProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [chartSize, setChartSize] = useState(0);

    useEffect(() => {
        const updateSize = () => {
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const size = Math.min(vw * 0.8, 600); // 80% of viewport width, max 600px
            setChartSize(size);
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        if (!chartRef.current || chartSize === 0) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const createDatasets = (): ChartDataset<'scatter'>[] => {
            const valueMap = synapsesPerConnectionData.values[0].value_map;
            const connectionClasses = ['ee', 'ei', 'ie', 'ii'];
            const colors = ['red', 'green', 'blue', 'magenta'];

            const datasets = connectionClasses.map((connectionClass, index) => ({
                label: connectionClass.toUpperCase(),
                data: Object.keys(valueMap.connection_class)
                    .filter(key => valueMap.connection_class[key] === connectionClass)
                    .map(key => ({
                        x: valueMap.mod_mean[key],
                        y: valueMap.bio_mean[key],
                        xErr: valueMap.mod_std[key],
                        yErr: valueMap.bio_std[key],
                    })),
                backgroundColor: colors[index],
                borderColor: colors[index],
            }));

            const maxX = Math.max(...Object.values(valueMap.mod_mean));
            const maxY = Math.max(...Object.values(valueMap.bio_mean));
            const maxValue = Math.max(maxX, maxY);

            // Add diagonal line
            datasets.push({
                label: 'Diagonal',
                data: [{ x: 0, y: 0 }, { x: maxValue, y: maxValue }],
                borderColor: 'black',
                borderDash: [5, 5],
                pointRadius: 0,
                showLine: true,
            });

            // Add fit lines
            const slopeII = synapsesPerConnectionData.values[1].value;
            const slopeRest = synapsesPerConnectionData.values[2].value;

            datasets.push({
                label: 'Fit (II)',
                data: [{ x: 0, y: 0 }, { x: maxValue, y: maxValue * slopeII }],
                borderColor: 'magenta',
                pointRadius: 0,
                showLine: true,
            });

            datasets.push({
                label: 'Fit (Rest)',
                data: [{ x: 0, y: 0 }, { x: maxValue, y: maxValue * slopeRest }],
                borderColor: 'red',
                pointRadius: 0,
                showLine: true,
            });

            return datasets;
        };

        const chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets: createDatasets() },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw as { x: number, y: number, xErr?: number, yErr?: number };
                                return `${context.dataset.label}: (${point.x.toFixed(2)} ± ${point.xErr?.toFixed(2) || 'N/A'}, ${point.y.toFixed(2)} ± ${point.yErr?.toFixed(2) || 'N/A'})`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: true, text: 'Structural circuit (#)' },
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'Bio data (#)' },
                    },
                },
            },
            plugins: [{
                id: 'errorBars',
                afterDatasetsDraw(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);
                        if (!meta.hidden) {
                            meta.data.forEach((element, index) => {
                                const { x, y, xErr, yErr } = dataset.data[index] as { x: number, y: number, xErr?: number, yErr?: number };
                                const xScale = chart.scales.x;
                                const yScale = chart.scales.y;

                                ctx.save();
                                ctx.lineWidth = 2;
                                ctx.strokeStyle = dataset.borderColor as string;

                                if (xErr) {
                                    ctx.beginPath();
                                    ctx.moveTo(xScale.getPixelForValue(x - xErr), yScale.getPixelForValue(y));
                                    ctx.lineTo(xScale.getPixelForValue(x + xErr), yScale.getPixelForValue(y));
                                    ctx.stroke();
                                }

                                if (yErr) {
                                    ctx.beginPath();
                                    ctx.moveTo(xScale.getPixelForValue(x), yScale.getPixelForValue(y - yErr));
                                    ctx.lineTo(xScale.getPixelForValue(x), yScale.getPixelForValue(y + yErr));
                                    ctx.stroke();
                                }

                                ctx.restore();
                            });
                        }
                    });
                }
            }]
        } as ChartConfiguration<'scatter'>);

        return () => {
            chart.destroy();
        };
    }, [chartSize]);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div style={{ width: `${chartSize}px`, height: `${chartSize}px`, margin: '0 auto' }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4 text-center">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(synapsesPerConnectionData, 'Synapses-Per-Connection-Data.json')}
                >
                    Synapses Per Connection Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesPerConnection;