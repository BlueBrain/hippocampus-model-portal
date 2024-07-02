import React, { useRef, useEffect } from 'react';
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Title,
} from 'chart.js';
import { Parser } from 'expr-eval';

import styles from './styles.module.scss';

export type ChannelParam = {
  channel: string;
  parameter: string;
  distribution: 'uniform' | string;
  min?: number;
  max?: number;
  formula?: string;
}

type ChannelParamPlotProps = {
  channelParam: ChannelParam;
}

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Title,
);

const ChannelParamPlot: React.FC<ChannelParamPlotProps> = ({ channelParam }) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  const createPlot = () => {
    const plotLength = 9;
    let maxValue = 0.012;
    let textBottom = '';

    if (!canvasEl.current) {
      return;
    }

    return new Chart(canvasEl.current, {
      type: 'line',
      data: {
        datasets: [{
          fill: 'origin',
          data: getData(channelParam),
          label: channelParam.parameter,
          backgroundColor: 'rgba(255, 177, 193, 0.5)',
        }],
        labels: getXAxes(),
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            suggestedMax: maxValue * 1.6,
            suggestedMin: 0,
          },
          x: {
            title: {
              display: true,
              text: 'µm',
            },
          },
        },
        plugins: {
          title: {
            font: {
              size: 12,
              weight: 'normal',
            },
            text: textBottom,
            position: 'bottom',
            display: true,
            padding: 6,
          },
          legend: {
            labels: {
              boxWidth: 0,
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });

    function getXAxes() {
      // generate scale with steps
      return Array.from({ length: plotLength }, (_, x) => x * 100);
    }

    function getData(parameter: ChannelParam): number[] {
      let arrayValues: number[] = [];
      switch (parameter.distribution) {
        case 'uniform':
          const UNIFORM_CONST = 1;
          arrayValues = new Array(plotLength).fill(UNIFORM_CONST);
          maxValue = UNIFORM_CONST;
          textBottom = UNIFORM_CONST.toString();
          break;
        default:
          if (parameter.formula) {
            const parser = new Parser();
            const equation = parameter.formula
              .replace(/math\.exp/g, 'exp')
              .replace(/\{/g, '(')
              .replace(/\}/g, ')');

            const expr = parser.parse(equation);
            arrayValues = getXAxes().map(xVal => expr.evaluate({ distance: xVal, value: 1 }));
            maxValue = Math.max(...arrayValues);
            textBottom = parameter.formula;
          } else {
            console.error('Formula is undefined');
          }
          break;
      }

      return arrayValues;
    }
  };

  useEffect(() => {
    if (!canvasEl.current) return;

    const plot = createPlot();

    return () => {
      if (plot) plot.destroy();
    };
  }, [canvasEl, channelParam]);

  return (
    <div className={styles.plotContainer}>
      <canvas ref={canvasEl} width="320" height="220" />
    </div>
  );
};

export default ChannelParamPlot;