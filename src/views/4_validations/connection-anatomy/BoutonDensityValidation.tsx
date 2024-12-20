import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';
import { graphTheme } from '@/constants';

Chart.register(
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend
);

export type BoutonDensityValidationProps = {
    theme?: number;
};

// Define the interface for the data structure
interface BoutonDensityValidationData {
    value_map: {
        mtype: { [key: number]: string };
        model_mean: { [key: number]: number };
        model_std: { [key: number]: number };
        exp_mean: { [key: number]: number };
    };
}

const BoutonDensityValidationGraph: React.FC<BoutonDensityValidationProps> = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<BoutonDensityValidationData | null>(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/connection-anatomy/bouton-density-validation.json')
            .then((response) => response.json())
            .then((data) => setData(data as BoutonDensityValidationData))
            .catch((error) => console.error('Error fetching bouton density validation data:', error));
    }, []);

    const createChart = () => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Define the error bar plugin
                const errorBarPlugin = {
                    id: 'errorBar',
                    afterDatasetsDraw(chart: any, args: any, options: any) {
                        const { ctx, data, scales: { x, y } } = chart;

                        ctx.save();
                        data.datasets.forEach((dataset: any) => {
                            if (dataset.label === 'Model') {
                                dataset.data.forEach((datapoint: any) => {
                                    if (datapoint.yMin !== undefined && datapoint.yMax !== undefined) {
                                        const xPos = x.getPixelForValue(datapoint.x);
                                        const yPosMin = y.getPixelForValue(datapoint.yMin);
                                        const yPosMax = y.getPixelForValue(datapoint.yMax);

                                        ctx.strokeStyle = dataset.borderColor;
                                        ctx.lineWidth = 2;

                                        // Draw vertical line
                                        ctx.beginPath();
                                        ctx.moveTo(xPos, yPosMin);
                                        ctx.lineTo(xPos, yPosMax);
                                        ctx.stroke();

                                        // Draw horizontal lines
                                        const horizontalLength = 5;
                                        ctx.beginPath();
                                        ctx.moveTo(xPos - horizontalLength, yPosMin);
                                        ctx.lineTo(xPos + horizontalLength, yPosMin);
                                        ctx.moveTo(xPos - horizontalLength, yPosMax);
                                        ctx.lineTo(xPos + horizontalLength, yPosMax);
                                        ctx.stroke();
                                    }
                                });
                            }
                        });
                        ctx.restore();
                    }
                };

                // Create the chart with the plugin included
                // In the chart configuration, remove the errorBar property from plugins
                const newChart = new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        labels: Object.values(data.value_map.mtype),
                        datasets: [
                            {
                                label: 'Model',
                                data: Object.values(data.value_map.mtype).map((_, index) => ({
                                    x: index,
                                    y: data.value_map.model_mean[index],
                                    yMin: data.value_map.model_mean[index] - data.value_map.model_std[index],
                                    yMax: data.value_map.model_mean[index] + data.value_map.model_std[index],
                                })),
                                backgroundColor: 'black',
                                borderColor: 'black',
                                pointStyle: 'circle',
                                pointRadius: 3,
                                showLine: false,
                            },
                            {
                                label: 'Experiment',
                                data: Object.values(data.value_map.mtype).map((_, index) => ({
                                    x: index,
                                    y: data.value_map.exp_mean[index],
                                })),
                                backgroundColor: graphTheme.red,
                                borderColor: graphTheme.red,
                                pointStyle: 'circle',
                                pointRadius: 3,
                                showLine: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'category',
                                title: {
                                    display: true,
                                    text: 'mtype',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'bouton density (um⁻¹)',
                                },
                                min: 0,
                                max: 0.5,
                            },
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
                                    font: {
                                        size: 11,
                                        weight: 'normal',
                                    },
                                },
                                onClick: () => { }, // Disable legend item click
                            },
                            title: {
                                display: false, // Remove the title
                            },
                        },
                    },
                    plugins: [errorBarPlugin], // Add the custom plugin here
                });

                setChart(newChart);
            }
        }
    };

    useEffect(() => {
        createChart();

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
    }, [data]);

    return (
        <div>
            <div className="graph" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Bouton-Density-Validation-Data.json`)}>
                    Bouton density
                </DownloadButton>
            </div>
        </div>
    );
};

export default BoutonDensityValidationGraph;