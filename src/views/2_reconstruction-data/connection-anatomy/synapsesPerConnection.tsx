import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, ChartDataset, registerables } from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

Chart.register(...registerables);

interface SynapsesPerConnectionProps {
    theme?: number;
}

interface SynapsesPerConnectionData {
    values: [
        {
            value_map: {
                connection_class: Record<string, string>;
                mod_mean: Record<string, number>;
                bio_mean: Record<string, number>;
                mod_std: Record<string, number>;
                bio_std: Record<string, number>;
            };
        },
        { value: number },
        { value: number }
    ];
}

interface CustomDataPoint {
    x: number;
    y: number;
    xErr?: number;
    yErr?: number;
}

// Custom plugin for error bars
const errorBarsPlugin = {
    id: 'errorBars',
    afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach((element, index) => {
                    const { x, y, xErr, yErr } = dataset.data[index] as CustomDataPoint;
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
};

const SynapsesPerConnection: React.FC<SynapsesPerConnectionProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [chartSize, setChartSize] = useState(0);
    const [data, setData] = useState<SynapsesPerConnectionData | null>(null);

    useEffect(() => {
        fetch(dataPath + '/2_reconstruction-data/connection-anatomy/synapses-per-conections.json')
            .then((response) => response.json())
            .then((fetchedData) => setData(fetchedData));
    }, []);

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
        if (!chartRef.current || chartSize === 0 || !data) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const createDatasets = (): ChartDataset<'scatter'>[] => {
            const valueMap = data.values[0].value_map;
            const connectionClasses = ['ee', 'ei', 'ie', 'ii'];
            const colors = ['red', 'green', 'blue', 'magenta'];

            const datasets: ChartDataset<'scatter'>[] = connectionClasses.map((connectionClass, index) => ({
                label: connectionClass.toUpperCase(),
                data: Object.keys(valueMap.connection_class)
                    .filter(key => valueMap.connection_class[key] === connectionClass)
                    .map(key => ({
                        x: valueMap.mod_mean[key],
                        y: valueMap.bio_mean[key],
                        xErr: valueMap.mod_std[key],
                        yErr: valueMap.bio_std[key],
                    } as CustomDataPoint)),
                backgroundColor: colors[index],
                borderColor: colors[index],
            }));

            const maxX = Math.max(...Object.values(valueMap.mod_mean));
            const maxY = Math.max(...Object.values(valueMap.bio_mean));
            const maxValue = Math.max(maxX, maxY);

            // Add diagonal line
            datasets.push({
                label: 'Diagonal',
                data: [
                    { x: 0, y: 0, xErr: 0, yErr: 0 },
                    { x: maxValue, y: maxValue, xErr: 0, yErr: 0 }
                ] as CustomDataPoint[],
                borderColor: 'black',
                borderDash: [5, 5],
                pointRadius: 0,
                showLine: true,
            });

            // Add fit lines
            const slopeII = data.values[1].value;
            const slopeRest = data.values[2].value;

            datasets.push({
                label: 'Fit (II)',
                data: [
                    { x: 0, y: 0, xErr: 0, yErr: 0 },
                    { x: maxValue, y: maxValue * slopeII, xErr: 0, yErr: 0 }
                ] as CustomDataPoint[],
                borderColor: 'magenta',
                pointRadius: 0,
                showLine: true,
            });

            datasets.push({
                label: 'Fit (Rest)',
                data: [
                    { x: 0, y: 0, xErr: 0, yErr: 0 },
                    { x: maxValue, y: maxValue * slopeRest, xErr: 0, yErr: 0 }
                ] as CustomDataPoint[],
                borderColor: 'red',
                pointRadius: 0,
                showLine: true,
            });

            return datasets;
        };

        const chartConfig: ChartConfiguration<'scatter'> = {
            type: 'scatter',
            data: {
                datasets: createDatasets(),
            },
            options: {
                animation: {
                    duration: 0
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw as CustomDataPoint;
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
            plugins: [errorBarsPlugin],
        };

        const chart = new Chart(ctx, chartConfig);

        return () => {
            chart.destroy();
        };
    }, [chartSize, data]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full max-w-3xl">
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <span>  Pink line: <i>y = 0.1096x</i></span>
                    <span>  Red line: <i>y=1.1690x</i></span>
                    <span>  Dashed line: <i>y = x</i></span>
                </div>
            </div>
            <div className='graph' style={{ width: `${chartSize}px`, height: `${chartSize}px` }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4 ">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, 'Synapses-Per-Connection-Data.json')}
                >
                    Synapses Per Connection Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesPerConnection;
