import React from 'react';
import NumberFormat from '../NumberFormat';
import isNil from 'lodash/isNil';

import Unit from '../Unit';
import ModelMorphologyStats from '../../model-morphology-stats.json';


const classPrefix = 'factsheet__';


type MorphologyFactsheetEntryType = {
  name: string;
  description?: string;
  unit?: string;
  value?: number | string;
  value_map?: {
    [key: string]: string | number;
  };
};


type MorphologyFactsheetProps = {
  morphologyName: string;
  className?: string;
};


const MorphologyFactsheetSingleValueEntry: React.FC<{
  fact: MorphologyFactsheetEntryType;
}> = ({
  fact
}) => {
  return (
    <div className="row mt-1">
      <div className="col-xs-8 col-sm-4 name">{fact.name}</div>
      <div className="col-xs-4 col-sm-8 value">
        {isNil(fact.value)
          ? (<span>-</span>)
          : (<span>
              <NumberFormat value={fact.value} /> <Unit value={fact.unit} />
            </span>)
        }
      </div>
    </div>
  );
};

const MorphologyFactsheetEntry: React.FC<{
  fact: MorphologyFactsheetEntryType
}> = ({
  fact
}) => {
  return (<MorphologyFactsheetSingleValueEntry fact={fact} />);
};

const neuriteTypes = ['all', 'axon', 'apical_dendrite', 'basal_dendrite'];

const strPrettify = (str) => str ? str.replace(/\_/g, ' ') : str;

const MorphologyFactsheet: React.FC<MorphologyFactsheetProps> = ({
  morphologyName,
  className = '',
}) => {
  const stats = ModelMorphologyStats[morphologyName];

  if (!stats) {
    return (
      <p className="red">No morphology stats found</p>
    );
  }

  const neuriteHasStats = (neuriteType) => !!stats[neuriteType].max_section_length;

  const getFactsheetEntries = (neuriteType) => {
    return Object.entries(stats[neuriteType]).map(([statKey, statValue]) => ({
      name: strPrettify(statKey),
      unit: (statKey as string).includes('volume') ? 'µm³' : ((statKey as string).includes('length') ? 'µm' : ''),
      value: statValue
    }));
  };

  return (
    <div className={`${classPrefix}basis ${className}`}>
      <div className="mb-3 mt-3">
        <MorphologyFactsheetEntry fact={{
          name: 'soma diameter',
          unit: 'µm',
          value: stats.mean_soma_radius * 2,
        }} />
      </div>

      {neuriteTypes.filter(neuriteType => neuriteHasStats(neuriteType)).map(neuriteType => (
        <div className="mb-2" key={neuriteType}>
          <strong className="text-capitalize">{strPrettify(neuriteType)}</strong>
          {getFactsheetEntries(neuriteType).map(fact => (
            <MorphologyFactsheetEntry key={fact.name} fact={fact as MorphologyFactsheetEntryType} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MorphologyFactsheet;
