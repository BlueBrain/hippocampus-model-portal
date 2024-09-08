import React, { useRef, useState, useEffect, useMemo } from "react";
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    ChartOptions,
} from 'chart.js';
import { themeColors } from "@/constants";
import { dataPath } from "@/config";
import styles from './ScatterPlotSelector.module.scss';
import { Loader2 } from 'lucide-react';

Chart.register(ScatterController, LinearScale, PointElement);

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
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<{ x: number, y: number }[]>([]);
    const [xAxis, setXAxis] = useState<number>(selectedX || xRange[0]);
    const [yAxis, setYAxis] = useState<number>(selectedY || yRange[0]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [maxY, setMaxY] = useState<number>(0);

    const getThemeColor = (theme: number): string => {
        const colorKeys = Object.keys(themeColors) as (keyof typeof themeColors)[];
        return themeColors[colorKeys[theme - 1]] || themeColors.experimental_data;
    };

    useEffect(() => {
        fetchData();
    }, [path, xAxis, yAxis]);

    useEffect(() => {
        if (chart) {
            chart.destroy();
        }
        if (chartRef.current && data.length > 0) {
            createChart();
        }
    }, [data, xAxisLabel, yAxisLabel, theme, maxY]);

    useEffect(() => {
        if (selectedX !== undefined && selectedX !== xAxis) {
            setXAxis(selectedX);
        }
        if (selectedY !== undefined && selectedY !== yAxis) {
            setYAxis(selectedY);
        }
    }, [selectedX, selectedY]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const fullUrl = `${dataPath}${path}${xAxis}-${yAxis}/spike-time-all.json`;
            console.log("Fetching data from:", fullUrl);
            const response = await fetch(fullUrl);
            const jsonData: SpikeTimeData[] = await response.json();

            const spikeTimes = jsonData.find(item => item.name === "Spike Times for SP_PC-cACpyr");

            if (spikeTimes && spikeTimes.value_map) {
                const { t, gid } = spikeTimes.value_map;
                const processedData = Object.keys(t).map(key => ({
                    x: t[key],
                    y: gid[key]
                }));
                setData(processedData);
                setMaxY(Math.max(...processedData.map(point => point.y)));
            } else {
                console.error('No spike time data found for SP_PC-cACpyr');
                setData([]);
                setMaxY(0);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setData([]);
            setMaxY(0);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoundedTicks = useMemo(() => (max: number) => {
        const ticks = [];
        const step = Math.pow(10, Math.floor(Math.log10(max / 10)));
        for (let i = 0; i <= max; i += step) {
            ticks.push(Math.round(i));
        }
        if (ticks[ticks.length - 1] < max) {
            ticks.push(Math.ceil(max / step) * step);
        }
        return ticks;
    }, []);

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const themeColor = getThemeColor(theme);
                const yTicks = getRoundedTicks(maxY);
                const chartOptions: ChartOptions<'scatter'> = {
                    responsive: true,
                    animation: { duration: 0 },
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: xAxisLabel,
                                color: themeColor,
                            },
                            ticks: {
                                color: themeColor,
                                font: { size: 10 },
                            },
                            grid: {
                                color: themeColor,
                                lineWidth: 0.5
                            },
                            border: {
                                color: themeColor,
                                width: 1
                            },
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: yAxisLabel,
                                color: themeColor,
                            },
                            min: 0,
                            max: maxY,
                            ticks: {
                                color: themeColor,
                                font: { size: 10 },
                                callback: (value) => yTicks.includes(value as number) ? value : '',
                            },
                            grid: {
                                color: themeColor,
                                lineWidth: 0.5
                            },
                            border: {
                                color: themeColor,
                                width: 1
                            },
                        }
                    },
                };

                const newChart = new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            data: data,

                            borderColor: themeColor,
                            pointRadius: .1,
                        }]
                    },
                    options: chartOptions,
                });

                setChart(newChart);
            }
        }
    };

    const handleAxisChange = (axis: 'x' | 'y', value: number) => {
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
    };

    const themeColor = getThemeColor(theme);

    return (
        <div className={styles.container} style={{ '--current-theme-color': themeColor } as React.CSSProperties}>
            <div className={styles.chartContainer}>
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <Loader2 className={styles.loader} style={{ color: themeColor }} />
                    </div>
                ) : (
                    <canvas ref={chartRef} />
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