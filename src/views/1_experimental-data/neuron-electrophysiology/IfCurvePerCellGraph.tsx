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
    instance?: string;
    theme?: number;
}

const IfCurvePerCellGraph: React.FC<IfCurvePerCellGraph> = ({ instance, theme }) => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [allInstances, setAllInstances] = useState<string[]>([]);
    const [selectedInstance, setSelectedInstance] = useState<string | undefined>(instance);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${dataPath}/1_experimental-data/neuronal-electophysiology/if-curve-per-cell-data.json`);
                const jsonData: IfCurveData = await response.json();

                setAllInstances(Object.keys(jsonData));

                if (selectedInstance) {
                    const instanceKey = selectedInstance.endsWith('.nwb') ? selectedInstance : `${selectedInstance}.nwb`;

                    if (jsonData[instanceKey]) {
                        const instanceData = Object.values(jsonData[instanceKey])
                            .map(item => ({
                                amplitude: item.amplitude,
                                mean_frequency: item.mean_frequency
                            }))
                            .sort((a, b) => a.amplitude - b.amplitude);
                        setData(instanceData);
                    } else {
                        console.error(`No data found for instance: ${instanceKey}`);
                        setData([]);
                    }
                } else if (allInstances.length > 0) {
                    setSelectedInstance(allInstances[0]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            }
        };

        fetchData();
    }, [selectedInstance]);

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

    if (allInstances.length === 0) {
        return <div>Loading instances...</div>;
    }

    return (
        <>
            <div className="mb-4">
                <label htmlFor="instance-select" className="mr-2">Select Instance:</label>
                <select
                    id="instance-select"
                    value={selectedInstance}
                    onChange={(e) => setSelectedInstance(e.target.value)}
                    className="border rounded p-1"
                >
                    {allInstances.map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                    ))}
                </select>
            </div>
            {data.length === 0 ? (
                <div>No data available for this instance.</div>
            ) : (
                <>
                    <div className='graph'>
                        <Scatter data={chartData} options={options} />
                    </div>
                    <div className="mt-4">
                        <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `If-Curve-data-${selectedInstance}.json`)}>
                            IF curve data for {selectedInstance}
                        </DownloadButton>
                    </div>
                </>
            )}
        </>
    );
};

export default IfCurvePerCellGraph;