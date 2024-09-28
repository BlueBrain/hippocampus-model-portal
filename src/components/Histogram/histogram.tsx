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
  color: string;
  title: string;

  values?: number[];

  bins?: number[];
  counts?: number[];
}

const plotlyLayout = {
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
};

const plotlyConfig = {
  responsive: true,
  displayModeBar: false,
  staticPlot: true,
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

  useEffect(() => {
    if (!chartContainerRef.current || !isIntersected) return;

    const chartEl = chartContainerRef.current;

    const data = getPlotData(values, bins, counts, color);

    requestIdleCallback(() => Plotly.newPlot(chartEl, data, { ...plotlyLayout, title }, plotlyConfig));

    return () => Plotly.purge(chartEl);
  }, [title, values, bins, counts, color, isIntersected]);

  return (
    <div
      className={style.container}
      ref={chartContainerRef}
    />
  );
};


export default Histogram;
