import React, { useState, useEffect, useMemo, useCallback } from "react";
import Plot from 'react-plotly.js';
import { themeColors } from "@/constants";
import { dataPath } from "@/config";
import styles from './ScatterPlotSelector.module.scss';
import { Loader2 } from 'lucide-react';

type ScatterPlotSelectorProps = {
    path: string;
    xAxisLabel: string;
    yAxisLabel: string;
    xRange: number[];
    yRange: number[];
    theme: number;
    onSelect: (x: number, y: number) => void;
    selectedX?: number;
    selectedY?: number;
};

interface SpikeTimeData {
    name: string;
    description: string;
    units: null;
    value_map: {
        t: { [key: string]: number };
        gid: { [key: string]: number };
    };
}

const ScatterPlotSelector: React.FC<ScatterPlotSelectorProps> = ({
    path,
    xAxisLabel,
    yAxisLabel,
    xRange,
    yRange,
    theme,
    onSelect,
    selectedX,
    selectedY
}) => {
    const [data, setData] = useState<{ x: number[], y: number[] }>({ x: [], y: [] });
    const [xAxis, setXAxis] = useState<number>(selectedX || xRange[0]);
    const [yAxis, setYAxis] = useState<number>(selectedY || yRange[0]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [maxY, setMaxY] = useState<number>(0);

    const getThemeColor = useCallback((theme: number): string => {
        const colorKeys = Object.keys(themeColors) as (keyof typeof themeColors)[];
        return themeColors[colorKeys[theme - 1]] || themeColors.experimental_data;
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const fullUrl = `${dataPath}${path}${xAxis}-${yAxis}/spike-time-all.json`;
            console.log("Fetching data from:", fullUrl);
            const response = await fetch(fullUrl);
            const jsonData: SpikeTimeData[] = await response.json();

            const spikeTimes = jsonData.find(item => item.name === "Spike Times for SP_PC-cACpyr");

            if (spikeTimes && spikeTimes.value_map) {
                const { t, gid } = spikeTimes.value_map;
                const x = Object.values(t);
                const y = Object.values(gid);
                setData({ x, y });
                setMaxY(Math.max(...y));
            } else {
                console.error('No spike time data found for SP_PC-cACpyr');
                setData({ x: [], y: [] });
                setMaxY(0);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setData({ x: [], y: [] });
            setMaxY(0);
        } finally {
            setIsLoading(false);
        }
    }, [path, xAxis, yAxis]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedX !== undefined && selectedX !== xAxis) {
            setXAxis(selectedX);
        }
        if (selectedY !== undefined && selectedY !== yAxis) {
            setYAxis(selectedY);
        }
    }, [selectedX, selectedY]);

    const getRoundedTicks = useMemo(() => (max: number): number[] => {
        if (max <= 0) return [0];
        const log10 = Math.floor(Math.log10(max));
        const step = Math.pow(10, log10 - 1);
        const numTicks = 10;
        const ticks: number[] = [];
        for (let i = 0; i < numTicks; i++) {
            const tick = Math.round((i * max) / (numTicks - 1) / step) * step;
            if (tick <= max && !ticks.includes(tick)) {
                ticks.push(tick);
            }
        }
        if (ticks[ticks.length - 1] < max) {
            ticks.push(max);
        }
        return ticks;
    }, []);

    const themeColor = useMemo(() => getThemeColor(theme), [getThemeColor, theme]);
    const yTicks = useMemo(() => getRoundedTicks(maxY), [getRoundedTicks, maxY]);

    const plotLayout = useMemo(() => ({
        autosize: true,
        margin: { l: 60, r: 20, t: 20, b: 40 },
        showlegend: false,
        xaxis: {
            title: {
                text: xAxisLabel,
                font: { size: 10 },
                standoff: 10,
            },
            color: themeColor,
            tickfont: { size: 8 },
            gridcolor: themeColor,
            gridwidth: 0.5,
            gridopacity: 0.75,
            linecolor: themeColor,
            linewidth: 1,
            zerolinecolor: themeColor,
            zerolinewidth: 1,
            range: [0, Math.max(...data.x)],
        },
        yaxis: {
            title: {
                text: yAxisLabel,
                font: { size: 10 },
                standoff: 15,
            },
            color: themeColor,
            tickfont: { size: 8 },
            gridcolor: themeColor,
            gridwidth: 0.5,
            gridopacity: 0.75,
            linecolor: themeColor,
            linewidth: 1,
            zerolinecolor: themeColor,
            zerolinewidth: 1,
            range: [0, maxY],
            tickmode: 'array',
            tickvals: yTicks,
            ticktext: yTicks.map(String),
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
    }), [xAxisLabel, yAxisLabel, themeColor, data.x, maxY, yTicks]);

    const plotData = useMemo(() => [{
        x: data.x,
        y: data.y,
        type: 'scattergl',
        mode: 'markers',
        marker: { color: themeColor, size: 1.5, opacity: 0.7 },
    }], [data, themeColor]);

    const plotConfig = {
        responsive: true,
        displayModeBar: false,
    };

    const handleAxisChange = useCallback((axis: 'x' | 'y', value: number) => {
        const range = axis === 'x' ? xRange : yRange;
        const closestValue = range.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        if (axis === 'x') {
            setXAxis(closestValue);
            onSelect(closestValue, yAxis);
        } else {
            setYAxis(closestValue);
            onSelect(xAxis, closestValue);
        }
    }, [xRange, yRange, onSelect, xAxis, yAxis]);

    return (
        <div className={styles.container} style={{ '--current-theme-color': themeColor } as React.CSSProperties}>
            <div className={styles.chartContainer}>
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <Loader2 className={styles.loader} style={{ color: themeColor }} />
                    </div>
                ) : (
                    <Plot
                        data={plotData}
                        layout={plotLayout}
                        config={plotConfig}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </div>
            <div className={styles.sliderContainer}>
                <div className={styles.sliderWrapper}>
                    <label htmlFor="xAxisSlider" className={styles.sliderLabel} style={{ color: themeColor }}>
                        {xAxisLabel}: <span className={styles.sliderValue}>{xAxis.toFixed(1)}</span>
                    </label>
                    <input
                        id="xAxisSlider"
                        type="range"
                        min={0}
                        max={xRange.length - 1}
                        step={1}
                        value={xRange.indexOf(xAxis)}
                        onChange={(e) => handleAxisChange('x', xRange[parseInt(e.target.value)])}
                        className={styles.slider}
                        style={{ '--slider-color': themeColor } as React.CSSProperties}
                    />
                </div>
                <div className={styles.sliderWrapper}>
                    <label htmlFor="yAxisSlider" className={styles.sliderLabel} style={{ color: themeColor }}>
                        {yAxisLabel}: <span className={styles.sliderValue}>{yAxis}</span>
                    </label>
                    <input
                        id="yAxisSlider"
                        type="range"
                        min={0}
                        max={yRange.length - 1}
                        step={1}
                        value={yRange.indexOf(yAxis)}
                        onChange={(e) => handleAxisChange('y', yRange[parseInt(e.target.value)])}
                        className={styles.slider}
                        style={{ '--slider-color': themeColor } as React.CSSProperties}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScatterPlotSelector;