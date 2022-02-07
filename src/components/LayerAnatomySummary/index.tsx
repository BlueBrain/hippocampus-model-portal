import React, { ReactNode } from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import ErrorBoundary from '../ErrorBoundary';
import HttpDownloadButton from '../HttpDownloadButton';
import { downloadAsJson } from '../../utils';
import { layers } from '../../constants';
import NumberFormat from '../NumberFormat';
import ResponsiveTable from '../ResponsiveTable';


const classPrefix = 'layer-anatomy-summary__';

export type LayerAnatomySummaryProps = {
  data?: ElasticSearchViewQueryResponse<any>['hits']['hits'];
  highlightLayer?: string;
};

type SummaryData = {
  layer: string,
  thicknessEntityDescription: ReactNode;
  thickness: ReactNode,
  thicknessN: ReactNode,
  rawThickness: any,
}

const LayerAnatomySummary: React.FC<LayerAnatomySummaryProps> = ({ data = [], highlightLayer = '' }) => {
  const entities = data.map(document => document._source);

  let thicknessUnit: string;

  const summary: SummaryData[] = layers.map((layer) => {
    const thicknessEntity = entities.find((entity) => (
      entity['@type'].toString().includes('Thickness')
        && entity.name === `Hippocampal layer thickness - CA1_${layer}`
        && entity.derivation?.length > 1
    ));

    const thicknessMean = thicknessEntity?.series.find((s: any) => s.statistic === 'mean')?.value;
    thicknessUnit = thicknessEntity?.series.find((s: any) => s.statistic === 'mean')?.unitCode;
    const thicknessN = thicknessEntity?.series.find((s: any) => s.statistic === 'N')?.value;
    const thicknessStd = thicknessEntity?.series.find((s: any) => s.statistic === 'standard deviation')?.value;

    const isHighlight = highlightLayer === layer;

    return {
      layer,
      thicknessEntityDescription: thicknessEntity.description,
      thickness: (<>
        <NumberFormat
          value={thicknessMean}
          thousandSeparator={false}
        /> &nbsp; <NumberFormat
          value={thicknessStd}
          prefix="± "
        />
      </>),
      thicknessN: <NumberFormat value={thicknessN} />,
      rawThickness: thicknessEntity,
      isHighlight,
    };
  });

  const factsheetData = summary.flatMap(summaryData => ([summaryData.rawThickness]));

  const columns = [
    { dataIndex: 'layer' as keyof SummaryData, title: 'Layer' },
    { title: 'Layer thickness',
      children: [
        { dataIndex: 'thickness' as keyof SummaryData, title: <> Mean, {thicknessUnit} </> },
        { dataIndex: 'thicknessN' as keyof SummaryData, title: 'No. of measurements', className: 'narrowColumn' },
      ] },
  ];

  return (
    <ErrorBoundary>
      {!!summary.length && (
        <div id="layerAnatomySummary" className={`${classPrefix}basis`}>
          <ResponsiveTable<SummaryData> columns={columns} data={summary} rowKey={({ layer }) => layer} />

          <div className="text-right mt-2">
            <HttpDownloadButton
              onClick={() => downloadAsJson(factsheetData, 'experimental-layer-anatomy-factsheet.json')}
            >
              factsheet
            </HttpDownloadButton>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default LayerAnatomySummary;
