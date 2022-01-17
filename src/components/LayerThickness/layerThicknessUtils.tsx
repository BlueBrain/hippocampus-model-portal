import React from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';
import keyBy from 'lodash/keyBy';

import { Layer } from '../../types';
import NumberFormat from '../NumberFormat';



export const getData = (layer: Layer, data?: ElasticSearchViewQueryResponse<any>['hits']['hits']) => {
  const entities = data.map(document => document._source);

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

      const name = subject.name.replace('subject', '').trim();
      const species= subject.species?.label;
      const mean = layerThickness.series?.find((s: any) => s.statistic === 'mean')?.value;
      const n = layerThickness.series.find((s: any) => s.statistic === 'N')?.value;

      return ({
        n,
        name,
        species,
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
