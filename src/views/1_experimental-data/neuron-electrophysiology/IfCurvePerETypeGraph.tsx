import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { dataPath } from '@/config';

import { graphTheme } from '@/constants';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const errorBarPlugin = {
    id: 'errorBar',
    afterDatasetsDraw(chart, args, options) {
        const { ctx, data, scales: { x, y } } = chart;

        ctx.save();
        ctx.strokeStyle = graphTheme.blue;
        ctx.lineWidth = 2;

        data.datasets[0].data.forEach((datapoint, index) => {
            const xPos = x.getPixelForValue(datapoint.x);
            const yPos = y.getPixelForValue(datapoint.y);

            const yError = Math.sqrt(datapoint.variance);
            const yPosUpper = y.getPixelForValue(datapoint.y + yError);
            const yPosLower = y.getPixelForValue(datapoint.y - yError);

            // Draw vertical line
            ctx.beginPath();
            ctx.moveTo(xPos, yPosUpper);
            ctx.lineTo(xPos, yPosLower);
            ctx.stroke();

            // Draw horizontal caps
            ctx.beginPath();
            ctx.moveTo(xPos - 5, yPosUpper);
            ctx.lineTo(xPos + 5, yPosUpper);
            ctx.moveTo(xPos - 5, yPosLower);
            ctx.lineTo(xPos + 5, yPosLower);
            ctx.stroke();
        });

        ctx.restore();
    }
};

const IfCurvePerETypeGraph = ({ eType, theme }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(dataPath + '/1_experimental-data/neuronal-electophysiology/if-curve-per-e-type-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data || !data[eType]) return <div>No data available for this e-type.</div>;

    const eTypeData = data[eType];
    const sortedData = Object.entries(eTypeData)
        .map(([amplitude, values]) => ({ x: parseFloat(amplitude), y: values.mean, variance: values.variance }))
        .sort((a, b) => a.x - b.x);

    const chartData = {
        datasets: [
            {
                data: sortedData,
                borderColor: graphTheme.blue,
                backgroundColor: graphTheme.blue
            },
        ],
    };

    const options = {
        scales: {
            x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Amplitude (nA)' } },
            y: { title: { display: true, text: 'Mean Frequency (Hz)' } },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.raw;
                        return [
                            `Mean: ${point.y.toFixed(2)} Hz`,
                            `Std Dev: ${Math.sqrt(point.variance).toFixed(2)}`,
                        ];
                    },
                },
            },
        },
    };

    return (
        <>
            <div className='graph'>
                <Line data={chartData} options={options} plugins={[errorBarPlugin]} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `If-Curve-${eType}-Data.json`)}>
                    If curve per e-type data
                </DownloadButton>
            </div>
        </>
    );
};

export default IfCurvePerETypeGraph;