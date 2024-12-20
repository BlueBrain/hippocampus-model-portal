import React, { ReactNode } from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import ErrorBoundary from '../ErrorBoundary';
import NumberFormat from '../NumberFormat';
import HttpDownloadButton from '../../components/HttpDownloadButton';
import { downloadAsJson } from '../../utils';
import { Layer } from '../../types';
import ResponsiveTable from '../ResponsiveTable';
import { getData } from './layerThicknessUtils';


const classPrefix = 'layer-thickness__';

export type LayerThicknessProps = {
  layer: Layer;
  data?: ElasticSearchViewQueryResponse<any>['hits']['hits'];
  className?: string;
};

type SliceElement = {
  name: string;
  species: string;
  sliceImage: ReactNode;
  layerThickness: ReactNode;
  n: ReactNode;
  contribution: String;
}

const LayerThickness: React.FC<LayerThicknessProps> = ({ layer, data = [], className = '' }) => {
  const { layerThicknesses, unit, factsheetData } = getData(layer, data);

  const columns = [
    { dataIndex: 'name' as keyof SliceElement, title: 'Animal' },
    { dataIndex: 'species' as keyof SliceElement, title: 'Species and strain' },
    { dataIndex: 'sliceImage' as keyof SliceElement , title: 'Slice image' },
    { dataIndex: 'layerThickness' as keyof SliceElement, title: <>Layer thickness, {unit}</> },
    { dataIndex: 'n' as keyof SliceElement, title: 'No. of measurements' },
    { dataIndex: 'contribution' as keyof SliceElement, title: 'Contribution' },
  ];

  return (
    <ErrorBoundary>
      <div id="layerThickness" className={`${classPrefix}basis ${className}`}>
        <ResponsiveTable<SliceElement>
          columns={columns}
          data={layerThicknesses}
          rowKey={({ name }, idx) => name + idx}
        />

        <div className="text-right mt-2">
          <HttpDownloadButton
            onClick={() => downloadAsJson(factsheetData, `CA1_${layer}-thickness-factsheet.json`)}
          >
            factsheet
          </HttpDownloadButton>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default LayerThickness;

