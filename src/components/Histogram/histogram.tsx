import React, { useRef, useEffect } from 'react';
import { useIntersection } from 'next/dist/client/use-intersection';
import { requestIdleCallback } from 'next/dist/client/request-idle-callback';
import Plotly from 'plotly.js-cartesian-dist';

import style from './histogram.module.scss';


const DEFAULT_INTERSECTION_ROOT_MARGIN = '400px';

const useLayoutEffect = typeof window === 'undefined'
  ? React.useEffect
  : React.useLayoutEffect;

export type HistogramProps = {
  values: number[];
  color: string;
  title: string;
};

const Histogram: React.FC<HistogramProps> = ({ title, values, color }) => {
  const chartContainerRef = useRef(null);
  const [setIntersection, isIntersected] = useIntersection({ rootMargin: DEFAULT_INTERSECTION_ROOT_MARGIN });

  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    setIntersection(chartContainerRef.current);
  }, [setIntersection]);

  useEffect(() => {
    if (!chartContainerRef.current || !isIntersected) return;

    const chartEl = chartContainerRef.current;

    const data = [{
      type: 'histogram',
      x: values,
      nbinsx: 10,
      marker: {
        color,
        opacity: 0.8,
      },
    }];

    const layout = {
      title,
      height: 160,
      margin: {
        l: 16,
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
    };

    const config = {
      responsive: true,
      displayModeBar: false,
      staticPlot: true,
    };

    requestIdleCallback(() => Plotly.newPlot(chartEl, data, layout, config));

    return () => Plotly.purge(chartEl);
  }, [title, values, color, isIntersected]);

  return (
    <div
      className={style.container}
      ref={chartContainerRef}
    />
  );
};


export default Histogram;
