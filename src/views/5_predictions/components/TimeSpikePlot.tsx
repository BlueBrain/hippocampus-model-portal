import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { graphTheme } from '@/constants';
import debounce from 'lodash/debounce';

// Import Plotly as a side effect to ensure it's available globally
import 'plotly.js/dist/plotly';

// Use dynamic import with no SSR for Plot
const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => <Loader2 className="w-8 h-8 animate-spin" />,
}) as any;

interface PlotData {
    name: string;
    description: string;
    units: string | null;
    value_map: {
        t: { [key: string]: number };
        gid: { [key: string]: number };
    };
}

interface PlotDetailsProps {
    plotData: PlotData | PlotData[] | null;
}

const LargeDatasetScatterPlot: React.FC<PlotDetailsProps> = ({ plotData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<any>(null);
    const workerRef = useRef<Worker | null>(null);

    const processData = useCallback((data: PlotData) => {
        if (!data || !data.value_map || !data.value_map.t || !data.value_map.gid) {
            setChartData(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        if (typeof window !== 'undefined') {
            if (workerRef.current) {
                workerRef.current.terminate();
            }

            workerRef.current = new Worker(URL.createObjectURL(new Blob([`
                self.onmessage = function(e) {
                    const { t, gid } = e.data;
                    const x = Object.values(t);
                    const y = Object.values(gid);
                    
                    const maxPoints = 100000;
                    let finalX = x;
                    let finalY = y;
                    if (x.length > maxPoints) {
                        const skipFactor = Math.ceil(x.length / maxPoints);
                        finalX = x.filter((_, index) => index % skipFactor === 0);
                        finalY = y.filter((_, index) => index % skipFactor === 0);
                    }
                    
                    self.postMessage({ x: finalX, y: finalY });
                }
            `], { type: 'text/javascript' })));

            workerRef.current.onmessage = function (e) {
                setChartData([{
                    x: e.data.x,
                    y: e.data.y,
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: graphTheme.blue, size: 2 },
                }]);
                setIsLoading(false);
            };

            workerRef.current.postMessage(data.value_map);
        }
    }, []);

    const debouncedProcessData = useCallback(debounce(processData, 300), [processData]);

    useEffect(() => {
        if (Array.isArray(plotData)) {
            debouncedProcessData(plotData[0]);
        } else if (plotData) {
            debouncedProcessData(plotData);
        } else {
            setChartData(null);
            setIsLoading(false);
        }

        return () => {
            debouncedProcessData.cancel();
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, [plotData, debouncedProcessData]);

    const layout = {
        xaxis: {
            title: 'Time (s)',
            color: '#666666',
            titlefont: { size: 12 },
            tickfont: { color: '#666666', size: 10 },
            showgrid: false,
        },
        yaxis: {
            title: {
                text: 'Neuron Index',
                standoff: 20,
            },
            color: '#666666',
            titlefont: { size: 12 },
            tickfont: { color: '#666666', size: 10 },
            showgrid: false,
        },
        autosize: true,
        plot_bgcolor: '#EFF1F8',
        paper_bgcolor: '#EFF1F8',
        showlegend: false,
        margin: { l: 60, r: 10, b: 50, t: 10, pad: 4 }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
    };

    return (
        <div style={{ width: '100%', height: '400px', position: 'relative', backgroundColor: '#EFF1F8' }}>
            {isLoading ? (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : !chartData ? (
                <p className="text-center text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">No data available.</p>
            ) : (
                <Plot
                    data={chartData}
                    layout={layout}
                    config={config}
                    style={{ width: '100%', height: '100%' }}
                />
            )}
        </div>
    );
};

export default LargeDatasetScatterPlot;