import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PlotParams } from 'react-plotly.js';
import { graphTheme, themeColors } from '@/constants';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as React.ComponentType<PlotParams>;

interface TraceDataProps {
    plotData?: {
        name: string;
        description: string;
        units: string | null;
        value_map: { [key: string]: number[] } | number[][];
    };
}

const PlotlyTraceGraph: React.FC<TraceDataProps> = ({ plotData }) => {
    const [data, setData] = useState<any[]>([]);
    const [layout, setLayout] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [hoveredTraceIndex, setHoveredTraceIndex] = useState<number | null>(null);
    const [allTracesVisible, setAllTracesVisible] = useState<boolean>(true);

    useEffect(() => {
        if (!plotData || !plotData.value_map || (Array.isArray(plotData.value_map) && plotData.value_map.length === 0) || Object.keys(plotData.value_map).length === 0) {
            console.log('No plot data available');
            setIsLoading(false);
            setHasError(true);
            return;
        }

        try {
            setIsLoading(true);
            setHasError(false);

            // Prepare data for Plotly
            let traces;
            if (Array.isArray(plotData.value_map)) {
                traces = plotData.value_map.map((trace, index) => ({
                    x: Array.from({ length: trace.length }, (_, i) => i * (5000 / (trace.length - 1))),
                    y: trace,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    name: `Trace ${index + 1}`,
                    line: {
                        color: `hsl(${index * 137.5 % 360}, 70%, 50%)`,
                        width: 1,
                    },
                    visible: allTracesVisible ? true : 'legendonly',
                }));
            } else {
                traces = Object.entries(plotData.value_map).map(([key, trace], index) => ({
                    x: Array.from({ length: trace.length }, (_, i) => i * (5000 / (trace.length - 1))),
                    y: trace,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    name: key,
                    line: {
                        color: `hsl(${index * 137.5 % 360}, 70%, 50%)`,
                        width: 1,
                    },
                    visible: allTracesVisible ? true : 'legendonly',
                }));
            }

            setData(traces);

            // Set up the layout
            setLayout({
                xaxis: {
                    title: { text: 'Time (ms)', standoff: 20 },
                    showticklabels: true,
                    tickmode: 'linear',
                    tick0: 0,
                    dtick: 500,  // Changed from 1000 to 500
                    range: [0, 5000],
                },
                yaxis: {
                    title: { text: 'Voltage (mV)', standoff: 40 },
                    showticklabels: true,
                },
                autosize: true,
                margin: { l: 60, r: 50, b: 100, t: 50, pad: 4 },
                hovermode: 'x unified' as const,
                showlegend: true,
                legend: { orientation: 'h', x: 0, y: 1.2 },
                plot_bgcolor: '#EFF1F8',
                paper_bgcolor: '#EFF1F8',
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error processing plot data:', error);
            setIsLoading(false);
            setHasError(true);
        }
    }, [plotData, allTracesVisible]);

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

    const handleLegendHover = (event: any) => {
        setHoveredTraceIndex(event.curveNumber);
    };

    const handleLegendUnhover = () => {
        setHoveredTraceIndex(null);
    };

    const toggleAllTraces = () => {
        setAllTracesVisible(!allTracesVisible);
        const updatedData = data.map(trace => ({
            ...trace,
            visible: !allTracesVisible ? true : 'legendonly',
        }));
        setData(updatedData);
    };

    return (
        <div>
            <button
                onClick={toggleAllTraces}
                style={{
                    marginBottom: '1rem',
                    padding: '0.25rem .5rem',
                    backgroundColor: graphTheme.blue,
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                }}
            >
                {allTracesVisible ? 'Hide All Traces' : 'Show All Traces'}
            </button>
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
                        onLegendItemClick={() => false}
                        onLegendItemHover={handleLegendHover}
                        onLegendItemUnhover={handleLegendUnhover}
                    />
                )}
            </div>
        </div>
    );
};

export default PlotlyTraceGraph;
