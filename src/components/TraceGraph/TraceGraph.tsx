import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Spin } from 'antd';
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
} from 'chart.js';
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

const interpolateArray = (data: number[], desiredLength: number) => {
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

interface TraceGraphProps {
    individualTrace: number[];
    meanTrace: number[];
    title: string;
}

const TraceGraph: React.FC<TraceGraphProps> = ({ individualTrace, meanTrace, title }) => {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData<'line'>>({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        setLoading(true);

        // Determine the length of the longer trace
        const maxLength = Math.max(individualTrace.length, meanTrace.length);
        const timeStepIndividual = 100 / (individualTrace.length - 1);
        const timeStepMean = 100 / (meanTrace.length - 1);

        const timeValuesIndividual = Array.from({ length: individualTrace.length }, (_, i) => i * timeStepIndividual);
        const timeValuesMean = Array.from({ length: meanTrace.length }, (_, i) => i * timeStepMean);

        // Interpolate both traces to the same length (max length of either trace)
        const extendedIndividualTrace = interpolateArray(individualTrace, maxLength);
        const extendedMeanTrace = interpolateArray(meanTrace, maxLength);

        const extendedTimeValues = Array.from({ length: maxLength }, (_, i) => (i * 100) / (maxLength - 1));

        // Prepare the chart data
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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            x: {
                display: false, // Hide the x-axis labels
            },
            y: {
                title: {
                    display: true,
                    text: 'Voltage (mV)',
                },
            },
        },
    };

    return (
        <Spin spinning={loading}>
            <Line data={chartData} options={options} />
        </Spin>
    );
};

export default TraceGraph;