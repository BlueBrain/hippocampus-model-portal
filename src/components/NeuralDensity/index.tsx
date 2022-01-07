import React, { ReactNode } from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import ErrorBoundary from '../ErrorBoundary';
import NumberFormat from '../NumberFormat';
import { Layer } from '../../types';
import { downloadAsJson } from '../../utils';
import HttpDownloadButton from '../HttpDownloadButton';
import ResponsiveTable from '../ResponsiveTable';


export type LayerThicknessProps = {
  layer?: Layer;
  data?: ElasticSearchViewQueryResponse<any>['hits']['hits'];
};

interface NeuralDensityData {
  layer: string,
  densityN: ReactNode;
  density: ReactNode;
}

const NeuralDensity: React.FC<LayerThicknessProps> = ({ layer, data = [] }) => {
  const entities = data.map(document => document._source);
  let densityUnit = '';

  // @ts-ignore
  const layerNums = layer.match(/(\d+)/)[0].split('');
  const layerLabels = layerNums.map(layerNum => `layer ${layerNum}`);

  const rawNeuralDensities = entities
    .filter(entity => entity['@type'].toString().includes('NeuronDensity'))
    .filter(entity => entity.derivation)
    .filter(entity => layerLabels.includes(entity.brainLocation?.layer?.label));

  const neuralDensities = rawNeuralDensities.map(neuralDensity => {
    densityUnit = neuralDensity.series.find((s: any) => s.statistic === 'mean')?.unitCode;
    const mean = neuralDensity.series.find((s: any) => s.statistic === 'mean')?.value;
    const std = neuralDensity.series.find((s: any) => s.statistic === 'standard deviation')?.value;
    return ({
      layer: neuralDensity.brainLocation.layer.label.replace(/layer /i, 'L'),
      density: <>
        <NumberFormat value={mean} />
        &nbsp;
        <NumberFormat value={std} prefix="± " />
      </>,
      densityN: neuralDensity.series.find((s: any) => s.statistic === 'N')?.value,
    });
  });

  const columns = [
    { dataIndex: 'layer' as keyof NeuralDensityData, title: 'Layer' },
    { title: 'Neuron density',
      children: [
        { dataIndex: 'density' as keyof NeuralDensityData, title: <>Mean ± std, {densityUnit}</> },
        { dataIndex: 'densityN' as keyof NeuralDensityData, title: 'No. of measurements', className: 'narrowColumn' },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <div id="neuronDensity" className="mt-3">
        <ResponsiveTable columns={columns} data={neuralDensities} />
        {/* <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th colSpan={2}>Neuron density, {densityUnit} (mean ± std)</th>
              <th className="narrowColumn">No. of measurements</th>
            </tr>
          </thead>
          <tbody>
            {neuralDensities.map(neuralDensity => (
              <tr key={neuralDensity.layer}>
                <td className="text-capitalize">{neuralDensity.layer}</td>
                <td><NumberFormat value={neuralDensity.mean} /></td>
                <td><NumberFormat value={neuralDensity.std} prefix="± " /></td>
                <td><NumberFormat value={neuralDensity.n} /></td>
              </tr>
            ))}
          </tbody>
        </table> */}
        <div className="text-right mt-2">
          <HttpDownloadButton
            onClick={() => downloadAsJson(rawNeuralDensities, `${layer}-neuron-density-factsheet.json`)}
          >
            factsheet
          </HttpDownloadButton>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NeuralDensity;
