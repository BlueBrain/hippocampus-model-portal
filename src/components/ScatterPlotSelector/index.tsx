import React, { useRef, useState, useEffect } from "react";
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    ChartOptions,
} from 'chart.js';
import { themeColors, GraphTheme, ThemeColors } from "@/constants";
import styles from './ScatterPlotSelector.module.scss';

Chart.register(ScatterController, LinearScale, PointElement);

type ScatterPlotSelectorProps = {
    xAxisLabel?: string;
    yAxisLabel?: string;
    theme: number;
};

const ScatterPlotSelector: React.FC<ScatterPlotSelectorProps> = ({
    xAxisLabel = "X Axis",
    yAxisLabel = "Y Axis",
    theme
}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [xAxis, setXAxis] = useState<number>(25);
    const [yAxis, setYAxis] = useState<number>(25);

    const getThemeColor = (theme: number): string => {
        const colorKeys = Object.keys(themeColors) as (keyof ThemeColors)[];
        return themeColors[colorKeys[theme - 1]] || themeColors.experimental_data;
    };

    useEffect(() => {
        if (chart) {
            chart.destroy();
        }
        if (chartRef.current) {
            createChart();
        }
    }, [xAxis, yAxis, xAxisLabel, yAxisLabel, theme]);

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                try {
                    const themeColor = getThemeColor(theme);
                    const chartOptions: ChartOptions<'scatter'> = {
                        responsive: true,
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
                                    display: false,
                                    text: xAxisLabel,
                                    color: themeColor,
                                },
                                min: 0,
                                max: 50,
                                ticks: {
                                    color: themeColor,
                                    font: {
                                        size: 12,
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
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: false,
                                    text: yAxisLabel,
                                    color: themeColor,
                                },
                                min: 0,
                                max: 50,
                                ticks: {
                                    color: themeColor,
                                    font: {
                                        size: 12,
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

                    const exampleData = {
                        datasets: [
                            {
                                label: 'Dataset 1',
                                data: [
                                    { x: xAxis, y: yAxis },
                                ],
                                backgroundColor: themeColor,
                                borderColor: themeColor,
                            }
                        ]
                    };

                    const newChart = new Chart(ctx, {
                        type: 'scatter',
                        data: exampleData,
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
                        min="0"
                        max="50"
                        value={xAxis}
                        onChange={(e) => setXAxis(Number(e.target.value))}
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
                        min="0"
                        max="50"
                        value={yAxis}
                        onChange={(e) => setYAxis(Number(e.target.value))}
                        className={styles.slider}
                        style={{ '--slider-color': themeColor } as React.CSSProperties}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScatterPlotSelector;