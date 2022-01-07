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

interface NeuronDensityData {
  layer: string,
  value: ReactNode;
  n: ReactNode;
}

const NeuronDensity: React.FC<LayerThicknessProps> = ({ layer, data = [] }) => {
  const entities = data.map(document => document._source);

  const rawNeuronDensities = entities
    .filter(entity => entity['@type'].toString().includes('NeuronDensity'))
    .filter(entity => entity.note.match(/validation/i))
    .filter(entity => entity.brainLocation?.brainRegion?.label === `CA1_${layer}`);

  const neuronDensities = rawNeuronDensities.map(neuralDensity => {
    const unit = neuralDensity.series.find((s: any) => s.statistic === 'mean')?.unitCode;
    const mean = neuralDensity.series.find((s: any) => s.statistic === 'mean')?.value;
    const std = neuralDensity.series.find((s: any) => s.statistic === 'standard deviation')?.value;
    const sem = neuralDensity.series.find((s: any) => s.statistic === 'standard error of the mean')?.value;

    return ({
      layer,
      value: <>
        <NumberFormat value={mean} />
        &nbsp;
        <NumberFormat value={std} prefix="± " />
      </>,
      sem: <NumberFormat value={sem} />,
      unit,
      n: neuralDensity.series.find((s: any) => s.statistic === 'N')?.value,
    });
  });

  const unit = neuronDensities[0]?.unit;

  const columns = [
    { dataIndex: 'layer' as keyof NeuronDensityData, title: 'Layer' },
    { title: 'Neuron density',
      children: [
        { dataIndex: 'value' as keyof NeuronDensityData, title: <>Mean ± std, {unit}</> },
        { dataIndex: 'sem' as keyof NeuronDensityData, title: <>Standard error of the mean, {unit}</> },
        { dataIndex: 'n' as keyof NeuronDensityData, title: 'No. of measurements', className: 'narrowColumn' },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <div id="neuronDensity" className="mt-3">
        <ResponsiveTable columns={columns} data={neuronDensities} />

        <div className="text-right mt-2">
          <HttpDownloadButton
            onClick={() => downloadAsJson(rawNeuronDensities, `${layer}-neuron-density-factsheet.json`)}
          >
            factsheet
          </HttpDownloadButton>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NeuronDensity;
