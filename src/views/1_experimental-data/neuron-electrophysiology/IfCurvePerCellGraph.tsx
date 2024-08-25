import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { dataPath } from '@/config';
import { graphTheme } from '@/constants';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);



type DataPoint = {
    amplitude: number;
    mean_frequency: number;
};

type IfCurveData = {

    [key: string]: {
        [key: string]: {
            amplitude: number;
            mean_frequency: number;
            spikecount: number;
        };
    };
};

interface IfCurvePerCellGraph {
    instance: string;
    theme?: number;
}

const IfCurvePerCellGraph: React.FC<IfCurvePerCellGraph> = ({ instance, theme }) => {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${dataPath}/1_experimental-data/neuronal-electophysiology/if-curve-per-cell-data.json`);
                const jsonData: IfCurveData = await response.json();

                const instanceKey = instance.endsWith('.nwb') ? instance : `${instance}.nwb`;

                if (jsonData[instanceKey]) {
                    const instanceData = Object.values(jsonData[instanceKey])
                        .map(item => ({
                            amplitude: item.amplitude,
                            mean_frequency: item.mean_frequency
                        }))
                        .sort((a, b) => a.amplitude - b.amplitude); // Sort by amplitude
                    setData(instanceData);
                } else {
                    console.error(`No data found for instance: ${instanceKey}`);
                    setData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            }
        };

        fetchData();
    }, [instance]);

    const chartData = {
        datasets: [
            {
                label: 'IF Curve',
                data: data.map(point => ({ x: point.amplitude, y: point.mean_frequency })),
                backgroundColor: graphTheme.blue,
                showLine: true,
                borderColor: graphTheme.blue,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'linear' as const,
                position: 'bottom' as const,
                title: {
                    display: true,
                    text: 'Amplitude (nA)',
                },
            },
            y: {
                type: 'linear' as const,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Mean Frequency (Hz)',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `Amplitude: ${context.parsed.x.toFixed(2)} nA, Frequency: ${context.parsed.y.toFixed(2)} Hz`;
                    }
                }
            }
        },
    };

    if (data.length === 0) {
        return <div>No data available for this instance.</div>;
    }

    return (
        <>
            <div className='graph' >
                <Scatter data={chartData} options={options} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `If-Curve-${eType}-Data.json`)}>
                    If curve per cell data
                </DownloadButton>
            </div>
        </>
    );
};

export default IfCurvePerCellGraph;