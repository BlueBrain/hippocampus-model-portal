import React from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';
import keyBy from 'lodash/keyBy';

import { composeNexusUrl } from '../../utils';
import NexusImage from '../NexusImage';
import { Layer } from '../../types';
import NumberFormat from '../NumberFormat';

export const getData = (layer: Layer, data?: ElasticSearchViewQueryResponse<any>['hits']['hits']) => {
  if (!data) {
    return {
      unit: undefined,
      layerThicknesses: [],
      factsheetData: [],
    };
  }

  const entities = data.map(document => document._source);

  const sliceCollections = entities.filter(entity => entity['@type'].toString().includes('SliceCollection'));
  const sliceCollectionById = keyBy(sliceCollections, '@id');

  const subjects = entities.filter(entity => entity['@type'].toString().includes('Subject'));
  const subjectById = keyBy(subjects, '@id');

  const organizations = entities.filter(entity => entity['@type'].toString().includes('Organization'));
  const organizationById = keyBy(organizations, '@id');

  const rawLayerThicknesses = entities
    .filter(entity => entity['@type'].toString().includes('LayerThickness'))
    .filter(entity => entity.brainLocation?.brainRegion?.label === `CA1_${layer}`)
    .filter(entity => !Array.isArray(entity.derivation));

  const layerThicknesses = rawLayerThicknesses
    .map(layerThickness => {
      const subject = subjectById[layerThickness.subject['@id']];
      const organization = organizationById[layerThickness.contribution.agent['@id']];
      const sliceCollection = sliceCollectionById[layerThickness.derivation.entity['@id']];
      const sliceImgId = sliceCollection.image['@id'];
      const sliceImgUrl = composeNexusUrl({ id: sliceImgId });

      const name = subject.name.replace('subject', '').trim();
      const species = subject.species?.label;
      const mean = layerThickness.series?.find((s: any) => s.statistic === 'mean')?.value;
      const n = layerThickness.series.find((s: any) => s.statistic === 'N')?.value;

      return ({
        n,
        name,
        species,
        sliceImage: (
          <div style={{ width: '160px' }}>
            <NexusImage
              src={sliceImgUrl}
              key={sliceImgUrl}
              width="640"
              height="480"
              sizes="120px"
              layout="responsive"
              alt="Slice image"
            />
          </div>
        ),
        layerThickness: (<NumberFormat value={mean} />),
        contribution: organization?.name,
      });
    })
    // sort by subject name
    .sort((a, b) => (a.name < b.name ? -1 : 1));

  const unit = rawLayerThicknesses[0]?.series.find((s: any) => s.statistic === 'mean')?.unitCode;

  return ({
    unit,
    layerThicknesses,
    factsheetData: [...rawLayerThicknesses, ...organizations],
  });
};