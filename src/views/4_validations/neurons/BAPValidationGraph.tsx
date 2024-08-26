import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ChartConfiguration,
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ScatterDataPoint,
    ChartEvent,
    ActiveElement,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import { GraphTheme } from '@/types';
import DownloadButton from '@/components/DownloadButton';
import { graphTheme } from '@/constants';
import { dataPath } from '@/config';

Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface BAPValidationData {
    values: Array<{
        value_map: {
            distance: { [key: string]: number };
            model_mean: { [key: string]: number };
            model_std: { [key: string]: number };
            exp_mean: { [key: string]: number };
        };
    }>;
}

interface BAPValidationGraphProps {
    theme: number;
}

interface ExtendedScatterDataPoint extends ScatterDataPoint {
    yMin: number;
    yMax: number;
}

const BAPValidationGraph: React.FC<BAPValidationGraphProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [bAPValidationData, setBAPValidationData] = useState<BAPValidationData | null>(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/neurons/bap-validation.json')
            .then(response => response.json())
            .then(data => setBAPValidationData(data))
            .catch(error => console.error('Error fetching bAP validation data:', error));
    }, []);

    const createChart = () => {
        if (chartRef.current && bAPValidationData) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            const modelData = bAPValidationData.values[0].value_map;
            const expData = bAPValidationData.values[1].value_map;

            const randomOffset = () => Math.random() * 30 - 15;

            const modelDataset = Object.keys(modelData.distance).map(key => ({
                x: modelData.distance[key] + randomOffset(),
                y: modelData.model_mean[key],
                yMin: modelData.model_mean[key] - modelData.model_std[key],
                yMax: modelData.model_mean[key] + modelData.model_std[key],
            }));

            const expDataset = Object.keys(expData.distance).map(key => ({
                x: expData.distance[key],
                y: expData.exp_mean[key],
                yMin: expData.exp_mean[key] - modelData.model_mean[key],
                yMax: expData.exp_mean[key] + modelData.model_mean[key],
            }));

            const config: ChartConfiguration<'scatter', ExtendedScatterDataPoint[]> = {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Model',
                            data: modelDataset,
                            backgroundColor: 'black',
                            borderColor: 'black',
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 7,
                            order: 2,
                        },
                        {
                            label: 'Experiment',
                            data: expDataset,
                            backgroundColor: graphTheme.red,
                            borderColor: graphTheme.red,
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 7,
                            order: 1,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Distance from soma (µm)',
                            },
                            min: 0,
                            max: 400,
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'bAP amplitude (mV)',
                            },
                            min: 0,
                            max: 100,
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'end',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 6,
                                boxHeight: 6,
                                padding: 20,
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y.toFixed(2);
                                    return `${label}: ${value} mV`;
                                }
                            }
                        }
                    }
                },
                plugins: [{
                    id: 'errorBars',
                    afterDatasetsDraw(chart, args, options) {
                        const { ctx, chartArea, scales } = chart;

                        chart.data.datasets.forEach((dataset, i) => {
                            const meta = chart.getDatasetMeta(i);

                            if (!meta.hidden) {
                                meta.data.forEach((element, index) => {
                                    const { x, y } = element.getProps(['x', 'y']);

                                    const dataPoint = dataset.data[index] as ExtendedScatterDataPoint;
                                    const yTop = scales.y.getPixelForValue(dataPoint.yMax);
                                    const yBottom = scales.y.getPixelForValue(dataPoint.yMin);

                                    ctx.save();
                                    ctx.strokeStyle = dataset.borderColor as string;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(x, yBottom);
                                    ctx.lineTo(x, yTop);
                                    ctx.stroke();
                                    ctx.restore();
                                });
                            }
                        });
                    }
                }]
            };

            const newChart = new Chart(ctx, config);
            setChartInstance(newChart);
        }
    };

    useEffect(() => {
        if (bAPValidationData) {
            createChart();
        }
    }, [bAPValidationData]);

    useEffect(() => {
        const handleResize = () => {
            if (chartInstance) {
                chartInstance.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [chartInstance]);

    if (!bAPValidationData) {
        return <div>Loading bAP validation data...</div>;
    }

    return (
        <>
            <div className="graph" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(bAPValidationData, `bAP-Validation-Data.json`)}>
                    bAP Validation Data
                </DownloadButton>
            </div>
        </>
    );
};

export default BAPValidationGraph;