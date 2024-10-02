import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { graphTheme } from '@/constants';

import * as Plotly from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js').then((mod) => mod.default), {
    ssr: false,
}) as unknown as React.ComponentType<Plotly.Plot>;

interface TraceDataProps {
    plotData?: {
        individual_traces: number[][];
        mean_trace: number[];
    };
}

const PlotlyTraceGraph: React.FC<TraceDataProps> = ({ plotData }) => {
    const [data, setData] = useState<any[]>([]);
    const [layout, setLayout] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        if (!plotData || !plotData.individual_traces || !plotData.mean_trace) {
            console.log('No plot data available');
            setIsLoading(false);
            setHasError(true);
            return;
        }

        try {
            setIsLoading(true);
            setHasError(false);

            // Prepare individual traces data
            const individualTraces = plotData.individual_traces.map((trace, index) => ({
                x: Array.from({ length: trace.length }, (_, i) => i),
                y: trace,
                type: 'scatter',
                mode: 'lines',
                name: `Individual Trace ${index + 1}`,
                line: { color: `#9EA0B2`, width: 1 },
                showlegend: false,
            }));

            // Prepare mean trace data
            const meanTrace = {
                x: Array.from({ length: plotData.mean_trace.length }, (_, i) => i),
                y: plotData.mean_trace,
                type: 'scatter',
                mode: 'lines',
                name: 'Mean Trace',
                line: { color: graphTheme.red, width: 3 },
            };

            setData([...individualTraces, meanTrace]);

            // Set up the layout
            setLayout({
                title: '',
                xaxis: {
                    title: 'Time (ms)',
                    showticklabels: false,
                },
                yaxis: {
                    title: 'Value (mV)',
                    showticklabels: true,
                },
                autosize: true,
                margin: { l: 60, r: 50, b: 50, t: 50, pad: 4 },
                hovermode: 'closest',
                showlegend: true,
                legend: { x: 1, xanchor: 'right', y: 1 },
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