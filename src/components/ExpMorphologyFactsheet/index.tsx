import React from 'react';
import NumberFormat from '../NumberFormat';
import isNil from 'lodash/isNil';

import Unit from '../Unit';
import expMorphologyStats from '../../exp-morphology-stats.json';


const classPrefix = 'factsheet__';


type FactsheetEntryType = {
  name: string;
  description?: string;
  unit?: string;
  value?: number | string;
  value_map?: {
    [key: string]: string | number;
  };
};


type FactsheetProps = {
  morphologyName: string;
  className?: string;
};


const FactsheetSingleValueEntry: React.FC<{
  fact: FactsheetEntryType;
}> = ({
  fact
}) => {
  return (
    <div className="row mt-1">
      <div className="col-xs-4 name">{fact.name}</div>
      <div className="col-xs-4 value">
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

const FactsheetEntry: React.FC<{
  fact: FactsheetEntryType
}> = ({
  fact
}) => {
  return (<FactsheetSingleValueEntry fact={fact} />);
};

const neuriteTypes = ['all', 'axon', 'apical_dendrite', 'basal_dendrite'];

const strPrettify = (str) => str ? str.replace(/\_/g, ' ') : str;

const Factsheet: React.FC<FactsheetProps> = ({
  morphologyName,
  className = '',
}) => {
  const stats = expMorphologyStats[morphologyName];

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
      <h3>Morphology factsheet</h3>

      <div className="mb-3 mt-3">
        <FactsheetEntry fact={{
          name: 'soma diameter',
          unit: 'µm',
          value: stats.mean_soma_radius,
        }} />
      </div>

      {neuriteTypes.filter(neuriteType => neuriteHasStats(neuriteType)).map(neuriteType => (
        <div className="mb-2" key={neuriteType}>
          <strong className="text-capitalize">{strPrettify(neuriteType)}</strong>
          {getFactsheetEntries(neuriteType).map(fact => (
            <FactsheetEntry key={fact.name} fact={fact as FactsheetEntryType} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Factsheet;
