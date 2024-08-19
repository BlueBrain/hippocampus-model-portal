import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ScatterController,
    LineController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import pspAttenuationData from './psp-attenuation.json';
import { GraphTheme } from '@/types';
import { graphTheme } from '@/constants';

Chart.register(
    ScatterController,
    LineController,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const PSPAttenuationGraph = ({ theme }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            const expData = pspAttenuationData.values[0].value_map;
            const modelData = pspAttenuationData.values[1].value_map;
            const modelFitData = pspAttenuationData.values[2].value_map;
            const expFitData = pspAttenuationData.values[4].value_map;

            const expDataset = Object.keys(expData.Distance).map(key => ({
                x: expData.Distance[key],
                y: expData['dend_psp/soma_psp'][key],
            }));

            const modelDataset = Object.keys(modelData.Distance).map(key => ({
                x: modelData.Distance[key],
                y: modelData['dend_psp/soma_psp'][key],
            }));

            const modelFitDataset = Object.keys(modelFitData.Distance).map(key => ({
                x: modelFitData.Distance[key],
                y: modelFitData.fit_model_data[key],
            }));

            const expFitDataset = Object.keys(expFitData.Distance).map(key => ({
                x: expFitData.Distance[key],
                y: expFitData.fit_exp_data[key],
            }));

            const newChart = new Chart(ctx, {
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
                            pointHoverRadius: 5,
                        },
                        {
                            label: 'Model Fit',
                            data: modelFitDataset,
                            backgroundColor: 'black',
                            borderColor: 'black',
                            pointRadius: 0,
                            showLine: true,
                            borderWidth: 3,
                        },
                        {
                            label: 'Experiment',
                            data: expDataset,
                            backgroundColor: graphTheme.red,
                            borderColor: graphTheme.red,
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 5,
                        },
                        {
                            label: 'Experiment Fit',
                            data: expFitDataset,
                            backgroundColor: graphTheme.red,
                            borderColor: graphTheme.red,
                            pointRadius: 0,
                            showLine: true,
                            borderWidth: 3,
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
                            max: 350,
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Dendrite PSP / Soma PSP',
                            },
                            min: 0,
                            max: 14,
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
                                    const xValue = context.parsed.x.toFixed(2);
                                    const yValue = context.parsed.y.toFixed(2);
                                    return `${label}: (${xValue} µm, ${yValue})`;
                                }
                            }
                        }
                    }
                }
            });

            setChartInstance(newChart);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (windowSize.width > 0 && windowSize.height > 0) {
            if (chartInstance) {
                chartInstance.destroy();
            }
            createChart();
        }
    }, [windowSize]);

    return (
        <div>
            <div className="graph" style={{ height: '600px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(pspAttenuationData, `PSP-Attenuation-Data.json`)}>
                    PSP Attenuation Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default PSPAttenuationGraph;