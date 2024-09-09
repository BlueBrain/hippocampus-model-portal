import React, { useMemo, useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { graphTheme } from '@/constants';
import { Scatter } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: {
        name: string;
        description: string;
        units: string | null;
        value_map: {
            t: { [key: string]: number };
            gid: { [key: string]: number };
        };
    };
}

const TimeSpikePlot: React.FC<PlotDetailsProps> = ({ plotData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!plotData || !plotData.value_map || !plotData.value_map.t || !plotData.value_map.gid) {
            setChartData(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const worker = new Worker(URL.createObjectURL(new Blob([`
            self.onmessage = function(e) {
                const { t, gid } = e.data;
                const dataPoints = Object.keys(t).map(key => ({
                    x: t[key],
                    y: gid[key]
                }));
                
                // Downsample if there are too many points
                const maxPoints = 100000;
                let finalDataPoints = dataPoints;
                if (dataPoints.length > maxPoints) {
                    const skipFactor = Math.ceil(dataPoints.length / maxPoints);
                    finalDataPoints = dataPoints.filter((_, index) => index % skipFactor === 0);
                }
                
                self.postMessage(finalDataPoints);
            }
        `], { type: 'text/javascript' })));

        worker.onmessage = function (e) {
            setChartData({
                datasets: [{
                    label: plotData.name,
                    data: e.data,
                    backgroundColor: graphTheme.blue,
                    pointRadius: 1,
                    pointHoverRadius: 1,
                }]
            });
            setIsLoading(false);
        };

        worker.postMessage(plotData.value_map);

        return () => worker.terminate();
    }, [plotData]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
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
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: { enabled: false },
            title: {
                display: true,
                color: graphTheme.blue,
            },
        },
    }), []);

    const containerStyle = {
        width: '100%',
        height: '400px', // Set a fixed height for the container
        position: 'relative' as const,
    };

    const loaderStyle = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    return (
        <div style={containerStyle}>
            {isLoading ? (
                <div style={loaderStyle}>
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : !chartData || !plotData || !plotData.value_map || !plotData.value_map.t || !plotData.value_map.gid ? (
                <p className="text-center text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">No data available.</p>
            ) : (
                <Scatter options={options} data={chartData} />
            )}
        </div>
    );
};

export default TimeSpikePlot;