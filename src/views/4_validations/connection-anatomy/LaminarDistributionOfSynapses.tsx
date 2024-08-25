import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { graphTheme } from '@/constants';

Chart.register(
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const LaminarDistributionOfSynapsesGraph = ({ theme }) => {
    const chartRef = useRef(null);
    const [chart, setChart] = useState(null);

    const data = {
        labels: ['SLM_PPA', 'SR_SCA', 'SP_AA', 'SP_BS', 'SP_CCKBC', 'SP_Ivy', 'SP_PC', 'SP_PVBC', 'SO_BP', 'SO_BS', 'SO_OLM', 'SO_Tri'],
        datasets: [
            {
                label: 'SO (Model)',
                data: [0, 26.65, 5.52, 32.64, 34.76, 34.40, 77.47, 33.10, 31.11, 33.11, 0.39, 57.41],
                backgroundColor: graphTheme.blue,
                stack: 'Model',
            },
            {
                label: 'SP (Model)',
                data: [0, 14.45, 89.96, 20.86, 43.95, 36.26, 11.48, 43.00, 24.54, 17.90, 0.55, 27.02],
                backgroundColor: graphTheme.yellow,
                stack: 'Model',
            },
            {
                label: 'SR (Model)',
                data: [35.48, 56.15, 4.52, 45.85, 21.03, 29.12, 3.34, 23.58, 40.36, 47.46, 31.28, 14.39],
                backgroundColor: graphTheme.green,
                stack: 'Model',
            },
            {
                label: 'SLM (Model)',
                data: [64.18, 1.88, 0, 0.20, 0.03, 0.02, 0.02, 0.05, 3.56, 0.90, 65.60, 0.13],
                backgroundColor: graphTheme.red,
                stack: 'Model',
            },
            {
                label: 'out (Model)',
                data: [0.34, 0.86, 0, 0.46, 0.24, 0.20, 7.68, 0.27, 0.43, 0.64, 2.18, 1.06],
                backgroundColor: graphTheme.purple,
                stack: 'Model',
            },
            {
                label: 'SO (Exp)',
                data: [0, 0, null, 47.6, 29.4, null, null, null, null, 48.1, null, 58.12],
                backgroundColor: graphTheme.blue,
                stack: 'Exp',
            },
            {
                label: 'SP (Exp)',
                data: [0, 0.2, null, 9.85, 62.85, null, null, null, null, 12.4, null, 18.11],
                backgroundColor: graphTheme.yellow,
                stack: 'Exp',
            },
            {
                label: 'SR (Exp)',
                data: [37.7, 97.4, null, 42.55, 7.75, null, null, null, null, 39.5, null, 23.77],
                backgroundColor: graphTheme.green,
                stack: 'Exp',
            },
            {
                label: 'SLM (Exp)',
                data: [62.3, 2.4, null, 0, 0, null, null, null, null, 0, null, 0],
                backgroundColor: graphTheme.red,
                stack: 'Exp',
            },
        ],
    };

    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');

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

                                // Clip to individual bar
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

        const config = {
            type: 'bar',
            data: data,
            options: {
                plugins: {
                    title: {
                        display: false,
                        text: 'Laminar Distribution of Synapses',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                    legend: {
                        display: false,
                        position: 'right',
                        labels: {
                            filter: function (item, chart) {
                                return !item.text.includes('(');
                            },
                            generateLabels: function (chart) {
                                const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                                const uniqueLabels = [];
                                const modelExp = [];

                                original.forEach(label => {
                                    if (label.text.includes('(Model)')) {
                                        modelExp.push({ ...label, text: 'Model', fillStyle: 'rgb(0, 0, 0)', strokeStyle: 'rgb(0, 0, 0)' });
                                    } else if (label.text.includes('(Exp)')) {
                                        modelExp.push({ ...label, text: 'Exp', fillStyle: 'rgb(255, 255, 255)', strokeStyle: 'rgb(0, 0, 0)' });
                                    } else {
                                        uniqueLabels.push(label);
                                    }
                                });

                                return [...modelExp, { text: '', fillStyle: 'rgba(0,0,0,0)' }, ...uniqueLabels];
                            }
                        }
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
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
                            text: 'Synapses (%)',
                        },
                    },
                },
            },
            plugins: [hachurePlugin],
        };

        const newChart = new Chart(ctx, config);
        setChart(newChart);
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
    }, []);

    return (
        <div>
            <div className="graph" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Laminar-Distribution-Of-Synapses-Data.json`)}>
                    Laminar Distribution Of Synapses Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default LaminarDistributionOfSynapsesGraph;