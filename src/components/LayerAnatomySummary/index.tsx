import React, { ReactNode } from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import { downloadAsJson } from '@/utils';
import { layers } from '@/constants';
import NumberFormat from '@/components/NumberFormat';
import ResponsiveTable from '@/components/ResponsiveTable';
import ErrorBoundary from '@/components/ErrorBoundary';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { layerDescription } from '@/terms';
import { termFactory } from '@/components/Term';

const Term = termFactory(layerDescription);

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

  let thicknessUnit: string = '';

  const summary: SummaryData[] = layers.map((layer) => {
    const thicknessEntity = entities.find((entity) => (
      entity['@type'].toString().includes('Thickness')
      && entity.name === `Hippocampal layer thickness - CA1_${layer}`
      && entity.derivation?.length > 1
    ));

    const thicknessMean = thicknessEntity?.series.find((s: any) => s.statistic === 'mean')?.value;
    thicknessUnit = thicknessEntity?.series.find((s: any) => s.statistic === 'mean')?.unitCode || thicknessUnit;
    const thicknessN = thicknessEntity?.series.find((s: any) => s.statistic === 'N')?.value;
    const thicknessStd = thicknessEntity?.series.find((s: any) => s.statistic === 'standard deviation')?.value;

    const isHighlight = highlightLayer === layer;

    return {
      layer,
      thicknessEntityDescription: thicknessEntity?.description,
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
    {
      title: 'Layer',
      dataIndex: 'layer' as keyof SummaryData,
      render: layer => (<Term term={layer} />)
    },
    {
      title: 'Layer thickness',
      children: [
        {
          title: (<> Mean ± std, {thicknessUnit} </>),
          dataIndex: 'thickness' as keyof SummaryData,
        },
        {
          title: 'No. of measurements (slices)',
          dataIndex: 'thicknessN' as keyof SummaryData,
          className: 'narrowColumn',
        },
      ],
    },
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