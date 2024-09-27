import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
    const [xAxis, setXAxis] = useState<number>(selectedX || xRange[0]);
    const [yAxis, setYAxis] = useState<number>(selectedY || yRange[0]);
    const [svgExists, setSvgExists] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const getThemeColor = useCallback((theme: number): string => {
        const colorKeys = Object.keys(themeColors) as (keyof typeof themeColors)[];
        return themeColors[colorKeys[theme - 1]] || themeColors.experimental_data;
    }, []);

    useEffect(() => {
        if (selectedX !== undefined && selectedX !== xAxis) {
            setXAxis(selectedX);
        }
        if (selectedY !== undefined && selectedY !== yAxis) {
            setYAxis(selectedY);
        }
    }, [selectedX, selectedY]);

    useEffect(() => {
        const checkSvgExists = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            setIsLoading(true);
            setSvgExists(null);
            const svgUrl = `${dataPath}/${path}${xAxis}-${yAxis}/spike-time-all.svg`;
            try {
                const response = await fetch(svgUrl, {
                    method: 'HEAD',
                    signal: abortControllerRef.current.signal
                });
                setSvgExists(response.ok);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setSvgExists(false);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(checkSvgExists, 300); // Debounce for 300ms

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [dataPath, path, xAxis, yAxis]);

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

    const themeColor = useMemo(() => getThemeColor(theme), [getThemeColor, theme]);

    return (
        <div className={styles.container} style={{ '--current-theme-color': themeColor } as React.CSSProperties}>
            <div className={styles.chartContainer} style={{ position: 'relative', height: '250px' }}>
                {isLoading ? (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: themeColor }} />
                    </div>
                ) : svgExists === false ? (
                    <p style={{ color: themeColor }} className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Data not available.
                    </p>
                ) : svgExists === true ? (
                    <img
                        src={`${dataPath}${path}${xAxis}-${yAxis}/spike-time-all.svg`}
                        alt="Spike Time Data"
                        onError={() => setSvgExists(false)}
                    />
                ) : null}
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