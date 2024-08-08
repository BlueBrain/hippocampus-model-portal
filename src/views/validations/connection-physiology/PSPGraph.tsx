import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

// Import the data from a separate file
import synapsesPerConnectionData from './synapses-per-conections.json';

const SynapsesPerConnection: React.FC<{ theme?: number }> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    const createDatasets = () => {
        const valueMap = synapsesPerConnectionData.values[0].value_map;
        const connectionClasses = ['ee', 'ei', 'ie', 'ii'];
        const colors = ['red', 'green', 'blue', 'magenta'];

        const datasets = connectionClasses.map((connectionClass, index) => {
            const filteredIndices = Object.keys(valueMap.connection_class).filter(
                key => valueMap.connection_class[key] === connectionClass
            );
            return {
                label: connectionClass.toUpperCase(),
                data: filteredIndices.map(i => ({
                    x: valueMap.mod_mean[i],
                    y: valueMap.bio_mean[i],
                    xErr: valueMap.mod_std[i],
                    yErr: valueMap.bio_std[i],
                })),
                backgroundColor: colors[index],
                borderColor: colors[index],
                pointStyle: 'circle',
                pointRadius: 6,
                pointHoverRadius: 8,
            };
        });

        // Add diagonal line
        const maxValue = Math.max(
            ...Object.values(valueMap.mod_mean),
            ...Object.values(valueMap.bio_mean)
        );
        datasets.push({
            label: 'Diagonal',
            data: [
                { x: 0, y: 0 },
                { x: maxValue, y: maxValue },
            ],
            borderColor: 'black',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
        });

        // Add fit lines
        const slopeII = synapsesPerConnectionData.values[1].value;
        const slopeRest = synapsesPerConnectionData.values[2].value;

        datasets.push({
            label: 'Fit (II)',
            data: [
                { x: 0, y: 0 },
                { x: maxValue, y: maxValue * slopeII },
            ],
            borderColor: 'magenta',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
        });

        datasets.push({
            label: 'Fit (Rest)',
            data: [
                { x: 0, y: 0 },
                { x: maxValue, y: maxValue * slopeRest },
            ],
            borderColor: 'red',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
        });

        return datasets;
    };

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const chart = new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: createDatasets(),
                    },
                    options: {
                        responsive: true,
                        aspectRatio: 1,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const dataset = context.dataset;
                                        const index = context.dataIndex;
                                        const x = dataset.data[index].x;
                                        const y = dataset.data[index].y;
                                        const xErr = dataset.data[index].xErr;
                                        const yErr = dataset.data[index].yErr;
                                        return `${dataset.label}: (${x.toFixed(2)} ± ${xErr?.toFixed(2) || 'N/A'}, ${y.toFixed(2)} ± ${yErr?.toFixed(2) || 'N/A'})`;
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'Structural circuit (#)',
                                },
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Bio data (#)',
                                },
                            },
                        },
                    },
                    plugins: [{
                        id: 'errorBars',
                        afterDraw: (chart) => {
                            const ctx = chart.ctx;
                            chart.data.datasets.forEach((dataset, i) => {
                                const meta = chart.getDatasetMeta(i);
                                if (!meta.hidden) {
                                    meta.data.forEach((element, index) => {
                                        const xScale = chart.scales.x;
                                        const yScale = chart.scales.y;
                                        const xErr = dataset.data[index].xErr;
                                        const yErr = dataset.data[index].yErr;
                                        const x = xScale.getPixelForValue(dataset.data[index].x);
                                        const y = yScale.getPixelForValue(dataset.data[index].y);

                                        if (xErr) {
                                            ctx.save();
                                            ctx.beginPath();
                                            ctx.moveTo(xScale.getPixelForValue(dataset.data[index].x - xErr), y);
                                            ctx.lineTo(xScale.getPixelForValue(dataset.data[index].x + xErr), y);
                                            ctx.strokeStyle = dataset.borderColor;
                                            ctx.stroke();
                                            ctx.restore();
                                        }

                                        if (yErr) {
                                            ctx.save();
                                            ctx.beginPath();
                                            ctx.moveTo(x, yScale.getPixelForValue(dataset.data[index].y - yErr));
                                            ctx.lineTo(x, yScale.getPixelForValue(dataset.data[index].y + yErr));
                                            ctx.strokeStyle = dataset.borderColor;
                                            ctx.stroke();
                                            ctx.restore();
                                        }
                                    });
                                }
                            });
                        }
                    }]
                });

                return () => {
                    chart.destroy();
                };
            }
        }
    }, [chartRef]);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="graph aspect-square">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4 text-center text-sm">
                <p>Fitting lines:</p>
                <p className="text-purple-600">I-I: y = 0.1096x</p>
                <p className="text-red-600">Rest: y = 1.1690x</p>
            </div>
            <div className="mt-4 text-center">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(synapsesPerConnectionData, `Synapses-Per-Connection-Data.json`)}
                >
                    Download Synapses Per Connection Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesPerConnection;