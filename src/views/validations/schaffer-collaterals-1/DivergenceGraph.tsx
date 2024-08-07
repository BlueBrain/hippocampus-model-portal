import React from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

import DivergenceData from './divergence.json';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DivergenceGraphProps {
    theme?: number;
}

const DivergenceGraph: React.FC<DivergenceGraphProps> = ({ theme }) => {
    const data = {
        labels: DivergenceData.bins.map((bin: number) => bin.toFixed(2)),
        datasets: [
            {
                label: DivergenceData.description,
                data: DivergenceData.counts,
                backgroundColor: '#050A30',
                borderColor: '#050A30',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: DivergenceData.description,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Synapse indegree on each CA1 PC',
                },
                ticks: {
                    callback: function (value: any, index: number) {
                        return index % 10 === 0 ? this.getLabelForValue(value) : '';
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: DivergenceData.units || 'Count',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <div className="graph">
                <Bar data={data} options={options} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(DivergenceData, `Divergence-Data.json`)}>
                    Divergence Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default DivergenceGraph;