import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { graphTheme } from '@/constants';
import debounce from 'lodash/debounce';

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
    const [dataRange, setDataRange] = useState<{ x: [number, number], y: [number, number] }>({ x: [0, 0], y: [0, 0] });

    const formatScientificNotation = (value: number): string => {
        if (value === 0) return '0';
        const exponent = Math.floor(Math.log10(Math.abs(value)));
        const mantissa = value / Math.pow(10, exponent);
        const roundedMantissa = Math.round(mantissa * 100) / 100;
        const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
        const superscriptExponent = Math.abs(exponent).toString().split('').map(digit => superscriptDigits[parseInt(digit)]).join('');
        return `${roundedMantissa}*10${exponent < 0 ? '⁻' : ''}${superscriptExponent}`;
    };

    const processData = useCallback((data: PlotData) => {
        if (!data || !data.value_map || !data.value_map.t || !data.value_map.gid) {
            setChartData(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const { t, gid } = data.value_map;
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

        setChartData([{
            x: finalX,
            y: finalY,
            type: 'scatter',
            mode: 'markers',
            marker: { color: graphTheme.blue, size: 2 },
        }]);

        setDataRange({
            x: [Math.min(...finalX), Math.max(...finalX)],
            y: [Math.min(...finalY), Math.max(...finalY)],
        });

        setIsLoading(false);
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
        };
    }, [plotData, debouncedProcessData]);

    const generateTicks = useCallback((min: number, max: number, count: number = 6) => {
        const range = max - min;
        const step = range / (count - 1);
        return Array.from({ length: count }, (_, i) => min + i * step);
    }, []);

    const layout = useMemo(() => {
        const xTicks = generateTicks(dataRange.x[0], dataRange.x[1]);
        const yTicks = generateTicks(dataRange.y[0], dataRange.y[1]);

        return {
            xaxis: {
                title: 'Time (ms)',
                color: '#666666',
                titlefont: { size: 12 },
                tickfont: { color: '#666666', size: 10 },
                showgrid: false,
                tickmode: 'array',
                tickvals: xTicks,
                ticktext: xTicks.map(formatScientificNotation),
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
                tickmode: 'array',
                tickvals: yTicks,
                ticktext: yTicks.map(formatScientificNotation),
            },
            autosize: true,
            plot_bgcolor: '#EFF1F8',
            paper_bgcolor: '#EFF1F8',
            showlegend: false,
            margin: { l: 60, r: 10, b: 50, t: 10, pad: 4 }
        };
    }, [dataRange, generateTicks, formatScientificNotation]);

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