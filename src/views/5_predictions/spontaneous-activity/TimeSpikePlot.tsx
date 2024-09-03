import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { graphTheme } from '@/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: any;
}

const TimeSpikePlot: React.FC<PlotDetailsProps> = ({ plotData }) => {
    const chartData = useMemo(() => {
        if (!plotData || !Array.isArray(plotData)) return null;

        const colors = Object.values(graphTheme);

        const datasets = plotData.reduce((acc: any[], item: any, index: number) => {
            if (item.value_map && item.value_map.t && item.value_map.gid) {
                const { t, gid } = item.value_map;
                const dataPoints = Object.keys(t).map(key => ({
                    x: parseFloat(t[key]),
                    y: parseInt(gid[key])
                }));

                if (dataPoints.length > 0) {
                    acc.push({
                        label: item.name,
                        data: dataPoints,
                        backgroundColor: colors[index % colors.length],
                        pointRadius: 3,
                        pointHoverRadius: 5,
                    });
                }
            }
            return acc;
        }, []);

        return { datasets };
    }, [plotData]);

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'linear' as const,
                position: 'bottom' as const,
                title: {
                    display: true,
                    text: 'Time (s)',
                    color: graphTheme.blue,
                },
                ticks: {
                    color: graphTheme.blue,
                },

            },
            y: {
                type: 'linear' as const,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Neuron Index',
                    color: graphTheme.blue,
                },
                ticks: {
                    color: graphTheme.blue,
                },
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: graphTheme.blue,
                },
            },
            title: {
                display: false,
                text: 'All Types',
                color: graphTheme.blue,
            },
        },
    };

    if (!chartData || chartData.datasets.length === 0) {
        return <p>No data available for the spike time plot.</p>;
    }

    return (
        <div className='graph'>
            <Scatter options={options} data={chartData} />
        </div>
    );
};

export default TimeSpikePlot;