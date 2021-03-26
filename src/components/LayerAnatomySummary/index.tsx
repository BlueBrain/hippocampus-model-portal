import React from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import ErrorBoundary from '../ErrorBoundary';
import NumberFormat from '../NumberFormat';

// import './style.scss';

const classPrefix = 'layer-anatomy-summary__';

export type LayerAnatomySummaryProps = {
  data?: ElasticSearchViewQueryResponse<any>['hits']['hits'];
};

const LayerAnatomySummary: React.FC<LayerAnatomySummaryProps> = ({ data = [] }) => {
  const entities = data.map(document => document._source);

  const layers = Array
    .from(new Set(entities.map(e => e.brainLocation?.layer?.label)))
    .filter(Boolean)
    .sort();

  const summary = layers.map((layer: string) => {
    const densityEntity = entities.find((entity) => {
      return entity['@type'].toString().includes('NeuronDensity')
        && entity.brainLocation?.layer?.label === layer
        && entity.derivation
    });

    const densityMean = densityEntity?.series.find((s: any) => s.statistic === 'mean')?.value;
    const densityUnit = densityEntity?.series.find((s: any) => s.statistic === 'mean')?.unitCode;
    const densityN = densityEntity?.series.find((s: any) => s.statistic === 'N')?.value;
    const densityStd = densityEntity?.series
      .find((s: any) => s.statistic === 'standard deviation')?.value;

    const thicknessEntity = entities.find((entity) => {
      return entity['@type'].toString().includes('Thickness')
        && entity.brainLocation?.layer?.label === layer
        && entity.derivation?.length > 1
    });

    const thicknessMean = thicknessEntity?.series.find((s: any) => s.statistic === 'mean')?.value;
    const thicknessUnit = thicknessEntity?.series.find((s: any) => s.statistic === 'mean')?.unitCode;
    const thicknessN = thicknessEntity?.series.find((s: any) => s.statistic === 'N')?.value;

    return {
      layer,
      thicknessEntityDescription: thicknessEntity.description,
      thickness: {
        mean: thicknessMean,
        unit: thicknessUnit,
        n: thicknessN,
      },
      density: {
        mean: densityMean,
        std: densityStd,
        unit: densityUnit,
        n: densityN,
      },
    };
  });

  return (
    <ErrorBoundary>
      {!!summary.length && <div className={`${classPrefix}basis`}>
        <table className="mb-2">
          <thead>
            <tr>
              <th>Layer</th>
              <th colSpan={2} >Layer thickness, {summary[0].thickness.unit} (mean)*</th>
              <th colSpan={3} >Neuron density, {summary[0].density.unit} (mean ± std)</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(row => (
              <tr key={row.layer}>
                <td className="text-capitalize">{row.layer}</td>
                <td><NumberFormat value={row.thickness.mean}/></td>
                <td><NumberFormat value={row.thickness.n} prefix="n=" /></td>
                <td><NumberFormat value={row.density.mean} /></td>
                <td><NumberFormat value={row.density.std} prefix="± " /></td>
                <td><NumberFormat value={row.density.n} prefix="n=" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <small className="ant-typography ant-typography-secondary">
          * {summary[0]?.thicknessEntityDescription}
        </small>
      </div>}
    </ErrorBoundary>
  );
}

export default LayerAnatomySummary;
