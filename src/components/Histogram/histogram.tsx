import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import Plotly from 'plotly.js-cartesian-dist';

import styles from './histogram.module.scss';

export type HistogramProps = {
  color: string;
  title: string;
  values?: number[];
  bins?: number[];
  counts?: number[];
};

type AxisLayout = {
  tickformat: string;
  tickmode: string;
  nticks: number;
  range?: [number, number];
  fixedrange?: boolean;
};

type PlotlyLayout = {
  margin: { l: number; t: number; r: number; b: number };
  font: { size: number; family: string };
  paper_bgcolor: string;
  plot_bgcolor: string;
  bargap: number;
  title: string;
  xaxis: AxisLayout;
  yaxis: AxisLayout;
};

const plotlyConfig: Partial<Plotly.Config> = {
  responsive: true,
  displayModeBar: false,
  staticPlot: true,
};

// Custom hook for intersection observer
const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (elementRef.current) observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [callback, options]);

  return [elementRef, isIntersecting] as const;
};

const formatScientificNotation = (value: number): string => {
  if (value === 0) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exponent);
  const roundedMantissa = Math.round(mantissa * 100) / 100;
  const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const superscriptExponent = Math.abs(exponent)
    .toString()
    .split('')
    .map((digit) => superscriptDigits[parseInt(digit)])
    .join('');
  return `${roundedMantissa}×10${exponent < 0 ? '⁻' : ''}${superscriptExponent}`;
};

const getPlotData = (values: number[] | undefined, bins: number[] | undefined, counts: number[] | undefined, color: string): Partial<Plotly.PlotData>[] => {
  if (values) {
    return [{
      type: 'histogram',
      x: values,
      nbinsx: 10,
      marker: {
        color,
        opacity: 0.8,
      },
    }];
  }

  if (bins && counts) {
    return [{
      type: 'bar',
      x: bins,
      y: counts,
      marker: {
        color,
        opacity: 0.8,
      },
    }];
  }

  return [];
};

const Histogram: React.FC<HistogramProps> = ({ title, color, values, bins, counts }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ rootMargin: '200px 0px' });

  const plotlyLayout: PlotlyLayout = useMemo(() => {
    const baseLayout: PlotlyLayout = {
      margin: { l: 24, t: 24, r: 16, b: 16 },
      font: { size: 10, family: 'Titillium Web' },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      bargap: 0,
      title,
      xaxis: {
        tickformat: '.2e',
        tickmode: 'auto',
        nticks: 5,
      },
      yaxis: {
        tickformat: '.2e',
        tickmode: 'auto',
        nticks: 5,
      },
    };

    const dataArray = values || bins;
    if (dataArray && dataArray.length === 1) {
      const singleValue = dataArray[0];
      baseLayout.xaxis.range = [singleValue - 1, singleValue + 1];
      baseLayout.xaxis.fixedrange = true;
    }

    return baseLayout;
  }, [title, values, bins]);

  useEffect(() => {
    if (!isIntersecting || !ref.current) return;

    const chartEl = ref.current;
    const data = getPlotData(values, bins, counts, color);

    const drawPlot = () => {
      Plotly.newPlot(chartEl, data, plotlyLayout, plotlyConfig).then(() => {
        const layout = (chartEl as any).layout;
        if (layout?.xaxis?._gridvals && layout?.yaxis?._gridvals) {
          const update = {
            'xaxis.ticktext': layout.xaxis._gridvals.map(formatScientificNotation),
            'yaxis.ticktext': layout.yaxis._gridvals.map(formatScientificNotation),
          };
          Plotly.relayout(chartEl, update);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(drawPlot);
    } else {
      setTimeout(drawPlot, 0);
    }

    return () => {
      Plotly.purge(chartEl);
    };
  }, [plotlyLayout, values, bins, counts, color, isIntersecting]);

  return (
    <div
      className={styles.container}
      ref={ref}
    />
  );
};

export default Histogram;