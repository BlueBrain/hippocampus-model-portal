import React from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import ErrorBoundary from '../ErrorBoundary';
import NumberFormat from '../NumberFormat';
import { Layer } from '../../types'

// import './style.scss';

const classPrefix = 'neural-density__';


export type LayerThicknessProps = {
  layer?: Layer;
  data?: ElasticSearchViewQueryResponse<any>['hits']['hits'];
  className?: string;
};

const NeuralDensity: React.FC<LayerThicknessProps> = ({ layer, data = [], className='' }) => {
  const entities = data.map(document => document._source);

  // @ts-ignore
  const layerNums = layer.match(/(\d+)/)[0].split('');
  const layerLabels = layerNums.map(layerNum => `layer ${layerNum}`);

  const rawNeuralDensities = entities
    .filter(entity => entity['@type'].toString().includes('NeuronDensity'))
    .filter(entity => entity.derivation)
    .filter(entity => layerLabels.includes(entity.brainLocation?.layer?.label));

  const neuralDensities = rawNeuralDensities.map(neuralDensity => ({
    layer: neuralDensity.brainLocation.layer.label,
    mean: neuralDensity.series.find((s: any) => s.statistic === 'mean')?.value,
    unit: neuralDensity.series.find((s: any) => s.statistic === 'mean')?.unitCode,
    std: neuralDensity.series.find((s: any) => s.statistic === 'standard deviation')?.value,
    n: neuralDensity.series.find((s: any) => s.statistic === 'N')?.value,
  }));

  const unit = neuralDensities.length
    ? neuralDensities[0].unit
    : ''

  return (
    <ErrorBoundary>
      <div className={`${classPrefix}basis ${className}`}>
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th colSpan={3}>Neuron density, {unit} (mean ± std)</th>
            </tr>
          </thead>
          <tbody>
            {neuralDensities.map(neuralDensity => (
              <tr key={neuralDensity.layer}>
                <td className="text-capitalize">{neuralDensity.layer}</td>
                <td><NumberFormat value={neuralDensity.mean} /></td>
                <td><NumberFormat value={neuralDensity.std} prefix="± " /></td>
                <td><NumberFormat value={neuralDensity.n} prefix="n=" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
};

export default NeuralDensity;
