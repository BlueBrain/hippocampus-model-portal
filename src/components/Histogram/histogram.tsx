import React, { useRef, useEffect, useMemo } from 'react';
import { useIntersection } from 'next/dist/client/use-intersection';
import { requestIdleCallback } from 'next/dist/client/request-idle-callback';
import Plotly from 'plotly.js-cartesian-dist';

import style from './histogram.module.scss';

const DEFAULT_INTERSECTION_ROOT_MARGIN = '400px';

const useLayoutEffect = typeof window === 'undefined'
  ? React.useEffect
  : React.useLayoutEffect;

export type HistogramProps = {
  color: string;
  title: string;
  values?: number[];
  bins?: number[];
  counts?: number[];
}

const plotlyConfig = {
  responsive: true,
  displayModeBar: false,
  staticPlot: true,
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
  return `${roundedMantissa}*10${exponent < 0 ? '⁻' : ''}${superscriptExponent}`;
};

function getPlotData(values, bins, counts, color) {
  if (values) {
    return [{
      type: 'histogram',
      x: values,
      nbinsx: 10,
      marker: {
        color,
        opacity: 0.8,
      },
    }]
  }

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

const Histogram: React.FC<HistogramProps> = ({ title, color, values, bins, counts }) => {
  const chartContainerRef = useRef(null);
  const [setIntersection, isIntersected] = useIntersection({ rootMargin: DEFAULT_INTERSECTION_ROOT_MARGIN });

  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;
    setIntersection(chartContainerRef.current);
  }, [setIntersection]);

  const plotlyLayout = useMemo(() => {
    const baseLayout = {
      margin: {
        l: 24,
        t: 24,
        r: 16,
        b: 16,
      },
      font: {
        size: 10,
        family: 'Titillium Web',
      },
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

    // Check if there's only one data point
    const dataArray = values || bins;
    if (dataArray && dataArray.length === 1) {
      const singleValue = dataArray[0];
      baseLayout.xaxis.range = [singleValue - 1, singleValue + 1];
      baseLayout.xaxis.fixedrange = true;
    }

    return baseLayout;
  }, [title, values, bins]);

  useEffect(() => {
    if (!chartContainerRef.current || !isIntersected) return;

    const chartEl = chartContainerRef.current;
    const data = getPlotData(values, bins, counts, color);

    requestIdleCallback(() => {
      Plotly.newPlot(chartEl, data, plotlyLayout, plotlyConfig).then(() => {
        // After the plot is created, update the tick labels if needed
        const xaxis = chartEl.layout.xaxis;
        const yaxis = chartEl.layout.yaxis;

        if (xaxis && xaxis._gridvals && yaxis && yaxis._gridvals) {
          const update = {
            'xaxis.ticktext': xaxis._gridvals.map(formatScientificNotation),
            'yaxis.ticktext': yaxis._gridvals.map(formatScientificNotation),
          };
          Plotly.relayout(chartEl, update);
        }
      });
    });

    return () => Plotly.purge(chartEl);
  }, [plotlyLayout, values, bins, counts, color, isIntersected]);

  return (
    <div
      className={style.container}
      ref={chartContainerRef}
    />
  );
};

export default Histogram;