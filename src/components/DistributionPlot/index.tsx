import React from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: any;
}

const DistrbutionPlot: React.FC<PlotDetailsProps> = ({ plotData }) => {
    if (!plotData) {
        return <div>Loading...</div>;
    }

    const data = {
        labels: plotData.bins.map((bin: number) => bin.toFixed(2)),
        datasets: [
            {
                label: plotData.description,
                data: plotData.counts,
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
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Bins',
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    callback: function (value: number, index: number) {
                        if (index % 10 === 0) {
                            const label = this.getLabelForValue(value);
                            return Number(label) % 1 === 0 ? Number(label).toString() : label;
                        } else {
                            return '';
                        }
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: plotData.unit || 'Counts',
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default DistrbutionPlot;