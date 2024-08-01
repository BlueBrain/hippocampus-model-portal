import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import { Row, Col, Collapse } from 'antd';

import { NeuriteType } from '@/types';
import { neuriteTypes, neuriteColor } from '@/constants';
import Histogram from '@/components/Histogram';


const { Panel } = Collapse;

export type MorphDistributionPlotsProps = {
  data: {
    [key: string]: {
      values: number[];
      unit: string;
      n: number;
      title: string;
      neuriteType: NeuriteType;
    }
  };
  type: 'population' | 'singleMorphology';
};

const histogramTitle = (entry) => {
  const titleSub = entry.key
    .replace(entry.neuriteType, '')
    .replace(/_/g, ' ')
    .replace(/  /g, ' ')
    .replace(/ of$/, '')
    .replace(/ of $/, '')
    .trim();

  const unitSub = entry.unit ? `, ${entry.unit}` : '';

  return capitalize(titleSub) + unitSub;
};

const MorphDistributionPlots: React.FC<MorphDistributionPlotsProps> = ({ data, type }) => {
  const plotEntries = sortBy(Object.entries(data).map(([key, val]) => ({ ...val, key })), 'key');
  const groupedEntries = groupBy(plotEntries, 'neuriteType');

  const availableNeuriteTypes = neuriteTypes.filter(neuriteType => groupedEntries[neuriteType]);
  const defaultOpenNeuriteTypes = availableNeuriteTypes.filter(neuriteType => neuriteType !== 'all');

  return (
    <>
      <Collapse defaultActiveKey={defaultOpenNeuriteTypes}>
        {availableNeuriteTypes.map(neuriteType => (
          <Panel
            header={<strong>{capitalize(neuriteType)}</strong>}
            key={neuriteType}
          >
            <Row
              key={neuriteType}
              className="w-100 mt-1 mb-1"
              gutter={[16, 24]}
              justify={type === 'singleMorphology' ? 'space-between' : undefined}
            >
              {groupedEntries[neuriteType].map(entry => (
                <Col
                  key={entry.key}
                  xs={12}
                  sm={8}
                  lg={6}
                >
                  <Histogram
                    title={histogramTitle(entry)}
                    values={entry.values}
                    bins={entry.bins}
                    counts={entry.counts}
                    color={neuriteColor[entry.neuriteType]}
                  />
                </Col>
              ))}
            </Row>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};


export default MorphDistributionPlots;
