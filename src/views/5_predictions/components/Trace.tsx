import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PlotParams } from 'react-plotly.js';

// Define the Plot component with correct typing
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as React.ComponentType<PlotParams>;

interface TraceDataProps {
    plotData?: {
        name: string;
        description: string;
        units: string | null;
        value_map: number[][];
    };
}

const PlotlyTraceGraph: React.FC<TraceDataProps> = ({ plotData }) => {
    const [data, setData] = useState<any[]>([]);
    const [layout, setLayout] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        if (!plotData || !plotData.value_map || !Array.isArray(plotData.value_map) || plotData.value_map.length === 0) {
            console.log('No plot data available');
            setIsLoading(false);
            setHasError(true);
            return;
        }

        try {
            setIsLoading(true);
            setHasError(false);

            // Prepare data for Plotly
            const traces = plotData.value_map.map((trace, index) => ({
                x: Array.from({ length: trace.length }, (_, i) => i),
                y: trace,
                type: 'scatter' as const,
                mode: 'lines' as const,
                name: `Trace ${index + 1}`,
                line: {
                    color: `hsl(${index * 137.5 % 360}, 70%, 50%)`,
                    width: 1,
                },
            }));

            setData(traces);

            // Set up the layout
            setLayout({
                xaxis: {
                    title: 'Time',
                    showticklabels: false,
                },
                yaxis: {
                    title: {
                        text: plotData.units || 'mV',
                        standoff: 15,
                    },
                    showticklabels: true,
                },
                autosize: true,
                margin: {
                    l: 60,
                    r: 50,
                    b: 50,
                    t: 50,
                    pad: 4,
                },
                hovermode: 'x unified' as const,
                showlegend: false,
                plot_bgcolor: '#EFF1F8',
                paper_bgcolor: '#EFF1F8',
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error processing plot data:', error);
            setIsLoading(false);
            setHasError(true);
        }
    }, [plotData]);

    const containerStyle = {
        width: '100%',
        height: '500px',
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
            ) : hasError || !data.length ? (
                <p className="text-center text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    No data available.
                </p>
            ) : (
                <Plot
                    data={data}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                />
            )}
        </div>
    );
};

export default PlotlyTraceGraph;