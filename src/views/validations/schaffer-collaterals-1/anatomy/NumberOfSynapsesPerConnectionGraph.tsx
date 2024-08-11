import React from 'react';
import { Chart, CategoryScale, LinearScale, LogarithmicScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

import NumberOfSynapsesPerConectionsData from './number-of-synapse-per-connection.json';

Chart.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);

interface NumberOfSynapsesPerConectionsGraphProps {
    theme?: number;
}

const NumberOfSynapsesPerConectionsGraph: React.FC<NumberOfSynapsesPerConectionsGraphProps> = ({ theme }) => {
    const bins = Object.values(NumberOfSynapsesPerConectionsData.value_map.bins);
    const counts = Object.values(NumberOfSynapsesPerConectionsData.value_map.synapse_per_conn);

    // Filter data to include only up to 9 synapses
    const filteredBins = bins.slice(0, 10);  // Include bins up to 9.5
    const filteredCounts = counts.slice(0, 10);

    const data = {
        labels: filteredBins,
        datasets: [
            {
                label: NumberOfSynapsesPerConectionsData.description,
                data: filteredCounts,
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
                text: NumberOfSynapsesPerConectionsData.name,
            },
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Number of synapses',
                },
                ticks: {
                    callback: function (value: any, index: number) {
                        return index;  // This will show 0, 1, 2, ..., 9
                    }
                },
                max: 9
            },
            y: {
                type: 'logarithmic' as const,
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
                <DownloadButton theme={theme} onClick={() => downloadAsJson(NumberOfSynapsesPerConectionsData, `Number-Of-Synapses-Per-Conections-Data.json`)}>
                    Number Of Synapses Per Conections Data
                </DownloadButton>
            </div>
        </div>
    );
};

export default NumberOfSynapsesPerConectionsGraph;