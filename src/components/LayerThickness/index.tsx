import React from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import ErrorBoundary from '../ErrorBoundary';
import { Layer } from '../../types'
import NexusImage from '../NexusImage';
import NumberFormat from '../NumberFormat';
import { hippocampus } from '../../config';

// import './style.scss';


const classPrefix = 'layer-thickness__';

export type LayerThicknessProps = {
  layer: Layer;
  data?: ElasticSearchViewQueryResponse<any>['hits']['hits'];
  className?: string;
};

const LayerThickness: React.FC<LayerThicknessProps> = ({ layer, data = [], className='' }) => {
  const entities = data.map(document => document._source);

  const rawSliceCollections = entities
    .filter(entity => entity['@type'].toString().includes('SliceCollection'));

  const rawLayerThicknesses = entities
    .filter(entity => entity['@type'].toString().includes('LayerThickness'))
    .filter(entity => !Array.isArray(entity.derivation));

  // @ts-ignore
  const layerNums = layer.match(/(\d+)/)[0].split('');

  const sliceCollections = rawSliceCollections
    // construct simplified sliceCollection object
    .map(sliceCollection => ({
      name: sliceCollection.name,
      // @ts-ignore
      images: sliceCollection.image.map(imageEntity => imageEntity['@id']),
      layerThicknesses: rawLayerThicknesses
        // filter layerThicknesses derived from current sliceCollection
        .filter(rawLayerThickness => {
          return rawLayerThickness.derivation?.entity['@id'] === sliceCollection['@id'];
        })
        // filter layerThicknesses for current layers
        .filter(rawLayerThickness => {
          return layerNums
            .map(layerNum => `layer ${layerNum}`)
            .includes(rawLayerThickness.brainLocation?.layer?.label);
        })
        // compose simplified layer thickness objects
        .map(rawLayerThickness => ({
          layer: rawLayerThickness.brainLocation.layer.label,
          unit: rawLayerThickness.series.find((s: any) => s.statistic === 'mean')?.unitCode,
          mean: rawLayerThickness.series.find((s: any) => s.statistic === 'mean')?.value,
          std: rawLayerThickness.series.find((s: any) => s.statistic === 'standard deviation')?.value,
          n: rawLayerThickness.series.find((s: any) => s.statistic === 'N')?.value,
        }))
        // sort by layer
        .sort((a, b) => a.layer < b.layer ? -1 : 1),
    }))
    // sort by species name
    .sort((a, b) => a.name < b.name ? -1 : 1);

  const unit = sliceCollections[0]?.layerThicknesses[0].unit;

  return (
    <ErrorBoundary>
      <div className={`${classPrefix}basis ${className}`}>
        <table>
          <thead>
            <tr>
              <th>Animal</th>
              <th>Preview</th>
              <th colSpan={4}>Layer thickness, {unit} (mean ± std)</th>
            </tr>
          </thead>
          <tbody>
            {sliceCollections.map(sliceCollection => (
              <tr key={sliceCollection.name}>
                <td className="td-nowrap">{sliceCollection.name}</td>
                <td className="image-cell">
                  {sliceCollection.images.map((image: string) => (
                    <div key={image} className="image-container">
                      <NexusImage
                        org={hippocampus.org}
                        project={hippocampus.project}
                        imageUrl={image}
                      />
                    </div>
                  ))}
                </td>
                <td className="td-nowrap">
                  {sliceCollection.layerThicknesses.map(layerThickness => (
                    <div key={layerThickness.layer}>
                      <span className="text-capitalize text-nowrap">
                        {layerThickness.layer}
                      </span>
                      <br/>
                    </div>
                  ))}
                </td>
                <td className="td-nowrap">
                  {sliceCollection.layerThicknesses.map(layerThickness => (
                    <div key={layerThickness.layer}>
                      <span className="text-nowrap">
                        <NumberFormat value={layerThickness.mean} />
                      </span>
                      <br/>
                    </div>
                  ))}
                </td>
                <td className="td-nowrap">
                  {sliceCollection.layerThicknesses.map(layerThickness => (
                    <div key={layerThickness.layer}>
                      <span className="text-nowrap">
                        <NumberFormat value={layerThickness.std} prefix="± " />
                      </span>
                      <br/>
                    </div>
                  ))}
                </td>
                <td className="td-nowrap">
                  {sliceCollection.layerThicknesses.map(layerThickness => (
                    <div key={layerThickness.layer}>
                      <span className="text-nowrap">
                        <NumberFormat value={layerThickness.n} prefix={'n='} />
                      </span>
                      <br/>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
};
export default LayerThickness;
