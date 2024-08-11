import React from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

import SynapsesConvergenceForPyramidalCellsData from './synapse-convergence-for-pyramidal-cells.json';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SynapsesConvergenceForPyramidalCellsGraphProps {
    theme?: number;
}

const SynapsesConvergenceForPyramidalCellsGraph: React.FC<SynapsesConvergenceForPyramidalCellsGraphProps> = ({ theme }) => {
    const data = {
        labels: SynapsesConvergenceForPyramidalCellsData.bins,
        datasets: [
            {
                label: SynapsesConvergenceForPyramidalCellsData.description,
                data: SynapsesConvergenceForPyramidalCellsData.counts,
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
                display: false,
                text: SynapsesConvergenceForPyramidalCellsData.name,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Synapse indegree',
                },
                ticks: {
                    callback: function (value: any, index: number) {
                        return index % 5 === 0 ? SynapsesConvergenceForPyramidalCellsData.bins[index].toFixed(0) : '';
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Count',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <div className="graph no-margin">
                <Bar data={data} options={options} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(SynapsesConvergenceForPyramidalCellsData, `Synapse-Convergence-For-Pyramidal-Cells-Data.json`)}>
                    Synapse Convergence For Pyramidal Cells Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapsesConvergenceForPyramidalCellsGraph;