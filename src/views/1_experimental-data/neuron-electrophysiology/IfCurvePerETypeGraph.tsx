import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';
import { dataPath } from '@/config';
import { graphTheme } from '@/constants';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import { GraphTheme } from '@/types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DataPoint {
    mean: number;
    variance: number;
}

interface ETypeData {
    [amplitude: string]: DataPoint;
}

interface Data {
    [eType: string]: ETypeData;
}

interface ChartDataPoint {
    x: number;
    y: number;
    variance: number;
}

interface IfCurvePerETypeGraphProps {
    eType: string;
    theme: number;
}

const errorBarPlugin = {
    id: 'errorBar',
    afterDatasetsDraw(chart: ChartJS, args: any, options: any) {
        const { ctx, data, scales: { x, y } } = chart;

        ctx.save();
        ctx.strokeStyle = graphTheme.blue;
        ctx.lineWidth = 1;

        data.datasets[0].data.forEach((datapoint: ChartDataPoint) => {
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

const IfCurvePerETypeGraph: React.FC<IfCurvePerETypeGraphProps> = ({ eType, theme }) => {
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${dataPath}/1_experimental-data/neuronal-electophysiology/if-curve-per-e-type-data.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData: Data = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No data available.</div>;
    if (!data[eType]) return <div>No data available for e-type: {eType}</div>;

    const eTypeData = data[eType];
    if (Object.keys(eTypeData).length === 0) return <div>No data points available for e-type: {eType}</div>;

    const sortedData: ChartDataPoint[] = Object.entries(eTypeData)
        .map(([amplitude, values]) => ({
            x: parseFloat(amplitude),
            y: values.mean,
            variance: values.variance
        }))
        .sort((a, b) => a.x - b.x);

    const chartData: ChartData<'line', ChartDataPoint[]> = {
        datasets: [
            {
                data: sortedData,
                borderColor: graphTheme.blue,
                backgroundColor: graphTheme.blue,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        animation: { duration: 0 },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: { display: true, text: 'Amplitude (nA)' }
            },
            y: {
                title: { display: true, text: 'Mean Frequency (Hz)' }
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.raw as ChartDataPoint;
                        if (point && typeof point.y === 'number' && typeof point.variance === 'number') {
                            return [
                                `Mean: ${point.y.toFixed(2)} Hz`,
                                `Std Dev: ${Math.sqrt(point.variance).toFixed(2)}`,
                            ];
                        }
                        return 'No data available';
                    },
                },
            },
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="if-curve-graph">
            <div className='graph'>
                <Line data={chartData} options={options} plugins={[errorBarPlugin]} />
            </div>
            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `If-Curve-Data.json`)}
                >
                    IF curve per e-type
                </DownloadButton>
            </div>
        </div>
    );
};

export default IfCurvePerETypeGraph;