import React, { useEffect, useState } from 'react';
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
    ChartData,
    ChartOptions
} from 'chart.js';

// Assuming graphTheme is imported from a constants file
import { graphTheme } from '@/constants';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define types
type TraceData = number[];

interface TraceGraphProps {
    individualTrace: TraceData;
    meanTrace: TraceData;
    title: string;
}

const interpolateArray = (data: TraceData, desiredLength: number): TraceData => {
    const step = (data.length - 1) / (desiredLength - 1);
    return Array.from({ length: desiredLength }, (_, i) => {
        const index = i * step;
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper) {
            return data[lower];
        }
        return data[lower] + (data[upper] - data[lower]) * (index - lower);
    });
};

const TraceGraph: React.FC<TraceGraphProps> = ({ individualTrace, meanTrace, title }) => {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

    useEffect(() => {
        setLoading(true);

        const maxLength = Math.max(individualTrace.length, meanTrace.length);
        const extendedTimeValues = Array.from({ length: maxLength }, (_, i) => (i * 100) / (maxLength - 1));

        const extendedIndividualTrace = interpolateArray(individualTrace, maxLength);
        const extendedMeanTrace = interpolateArray(meanTrace, maxLength);

        const newChartData: ChartData<'line'> = {
            labels: extendedTimeValues,
            datasets: [
                {
                    label: 'Individual Trace',
                    data: extendedIndividualTrace,
                    borderColor: graphTheme.blue,
                    backgroundColor: graphTheme.blue,
                    borderWidth: 2,
                    pointRadius: 0,
                },
                {
                    label: 'Mean Trace',
                    data: extendedMeanTrace,
                    borderColor: graphTheme.red,
                    backgroundColor: graphTheme.red,
                    borderWidth: 2,
                    pointRadius: 0,
                },
            ],
        };

        setChartData(newChartData);
        setLoading(false);
    }, [individualTrace, meanTrace]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                title: {
                    display: true,
                    text: 'Voltage (mV)',
                },
            },
        },
    };

    if (loading || !chartData) {
        return <div>Loading...</div>;
    }

    return <Line data={chartData} options={options} />;
};

export default TraceGraph;