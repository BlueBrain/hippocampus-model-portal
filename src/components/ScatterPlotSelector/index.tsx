import React, { useRef, useState, useEffect } from "react";
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

Chart.register(ScatterController, LinearScale, PointElement);

type ScatterPlotSelectorProps = {
    path: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    xRange: number[];
    yRange: number[];
    theme: number;
    onSelect: (x: number, y: number) => void;
    selectedX?: number;
    selectedY?: number;
};

const ScatterPlotSelector: React.FC<ScatterPlotSelectorProps> = ({
    path,
    xAxisLabel = "Minis Rate",
    yAxisLabel = "ca_0",
    xRange,
    yRange,
    theme,
    onSelect,
    selectedX,
    selectedY
}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{ x: number, y: number }[]>([]);
    const [xAxis, setXAxis] = useState<number>(selectedX || xRange[0]);
    const [yAxis, setYAxis] = useState<number>(selectedY || yRange[0]);

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
    }, [data, xAxisLabel, yAxisLabel, theme]);

    useEffect(() => {
        if (selectedX !== undefined && selectedX !== xAxis) {
            setXAxis(selectedX);
        }
        if (selectedY !== undefined && selectedY !== yAxis) {
            setYAxis(selectedY);
        }
    }, [selectedX, selectedY]);

    const fetchData = async () => {
        try {
            const fullUrl = `${dataPath}${path}${yAxis}-${xAxis}/spike-time.json`;
            const response = await fetch(fullUrl);
            const jsonData = await response.json();
            const spikeTimes = jsonData.find((item: any) => item.name === "Spike Times for SP_PC-cACpyr");
            if (spikeTimes && spikeTimes.value_map) {
                const { t, gid } = spikeTimes.value_map;
                const processedData = Object.keys(t).map(key => ({
                    x: parseFloat(t[key]),
                    y: parseInt(gid[key])
                }));
                setData(processedData);
            } else {
                setError('No valid data found in the JSON file');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again.');
        }
    };

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                try {
                    const themeColor = getThemeColor(theme);
                    const yMin = Math.min(...data.map(d => d.y));
                    const yMax = Math.max(...data.map(d => d.y));
                    const chartOptions: ChartOptions<'scatter'> = {
                        responsive: true,
                        animation: {
                            duration: 0
                        },
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
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
                                min: Math.min(...data.map(d => d.x)),
                                max: Math.max(...data.map(d => d.x)),
                                ticks: {
                                    color: themeColor,
                                    font: {
                                        size: 10,
                                    },
                                    maxRotation: 0,
                                    minRotation: 0,
                                    callback: function (value, index, ticks) {
                                        if (index === 0 || index === ticks.length - 1) {
                                            return this.getLabelForValue(value as number);
                                        }
                                        return '';
                                    }
                                },
                                grid: {
                                    display: true,
                                    drawOnChartArea: false,
                                    color: themeColor,
                                    lineWidth: 2
                                },
                                border: {
                                    color: themeColor,
                                    width: 2
                                },
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: false,
                                    text: yAxisLabel,
                                    color: themeColor,
                                },
                                min: yMin,
                                max: yMax,
                                ticks: {
                                    color: themeColor,
                                    font: {
                                        size: 10,
                                    },
                                    callback: function (value, index, ticks) {
                                        if (index === 0 || index === ticks.length - 1) {
                                            return this.getLabelForValue(value as number);
                                        }
                                        return '';
                                    },

                                },
                                grid: {
                                    display: true,
                                    drawOnChartArea: false,
                                    color: themeColor,
                                    lineWidth: 2
                                },
                                border: {
                                    color: themeColor,
                                    width: 2
                                },
                            }
                        },
                    };

                    const chartData = {
                        datasets: [
                            {
                                label: 'Spike Times',
                                data: data,
                                backgroundColor: "white",
                                borderColor: "white",
                                pointRadius: 1,
                                pointHoverRadius: 1,
                            }
                        ]
                    };

                    const newChart = new Chart(ctx, {
                        type: 'scatter',
                        data: chartData,
                        options: chartOptions,
                    });

                    setChart(newChart);
                    setError(null);
                } catch (err) {
                    console.error('Error creating chart:', err);
                    setError('Failed to create chart. Please try again.');
                }
            } else {
                setError('Could not get 2D context from canvas element');
            }
        } else {
            setError('Canvas reference is not available');
        }
    };

    const handleXAxisChange = (value: number) => {
        const closestValue = xRange.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        setXAxis(closestValue);
        onSelect(closestValue, yAxis);
    };

    const handleYAxisChange = (value: number) => {
        const closestValue = yRange.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        setYAxis(closestValue);
        onSelect(xAxis, closestValue);
    };

    const themeColor = getThemeColor(theme);

    return (
        <div className={styles.container} style={{ '--current-theme-color': themeColor } as React.CSSProperties}>
            <div className={styles.chartContainer}>
                {error ? (
                    <div className={styles.errorMessage}>{error}</div>
                ) : (
                    <canvas ref={chartRef} />
                )}
            </div>
            <div className={styles.sliderContainer}>
                <div className={styles.sliderWrapper}>
                    <label htmlFor="xAxisSlider" className={styles.sliderLabel} style={{ color: themeColor }}>
                        {xAxisLabel}: <span className={styles.sliderValue}>{xAxis}</span>
                    </label>
                    <input
                        id="xAxisSlider"
                        type="range"
                        min={0}
                        max={xRange.length - 1}
                        step={1}
                        value={xRange.indexOf(xAxis)}
                        onChange={(e) => handleXAxisChange(xRange[parseInt(e.target.value)])}
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
                        onChange={(e) => handleYAxisChange(yRange[parseInt(e.target.value)])}
                        className={styles.slider}
                        style={{ '--slider-color': themeColor } as React.CSSProperties}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScatterPlotSelector;