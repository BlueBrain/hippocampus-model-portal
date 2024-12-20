import React from 'react';
import NumberFormat from '../NumberFormat';
import isNil from 'lodash/isNil';

import Unit from '../Unit';
import { termFactory } from '@/components/Term';

const Term = termFactory();

const classPrefix = 'factsheet__';

export type FactsheetEntryType = {
  name: string;
  description: string;
  units?: string;
  unit?: string;
  value?: number | string;
  values?: number[];
  value_map?: {
    [key: string]: string | number;
  };
};

type FactsheetProps = {
  facts: FactsheetEntryType[];
  className?: string;
};

const FactsheetSingleValueEntry: React.FC<{
  fact: FactsheetEntryType;
}> = ({
  fact
}) => {
    return (
      <div className="row mt-1">
        <div className="col-xs-6 col-sm-4 name">
          <Term term={fact.name} description={fact.description} />
        </div>
        <div className="col-xs-6 col-sm-8 value">
          {isNil(fact.value)
            ? (<span>-</span>)
            : (<span>
              <NumberFormat value={fact.value} /> <Unit value={fact.units || fact.unit} />
            </span>)
          }
        </div>
      </div>
    );
  };

const FactsheetSingleMeanStdEntry: React.FC<{
  fact: FactsheetEntryType;
}> = ({
  fact,
}) => {
    const mean = fact.value_map?.mean ?? (fact.values?.[0] ?? '-');
    const std = fact.value_map?.std ?? (fact.values?.[1] ?? '-');

    const formatValue = (value: string | number) => {
      if (typeof value === 'number') {
        return value.toFixed(3);
      }
      return value;
    };

    const formatNumberWithoutCommas = (value: string | number) => {
      if (typeof value === 'number') {
        return value.toString().replace(/,/g, '');
      }
      return value;
    };

    return (
      <div className="row mt-1">
        <div className="col-xs-4 name">
          <Term term={fact.name} description={fact.description} />
        </div>
        <div className="col-xs-4 value">
          {formatNumberWithoutCommas(formatValue(mean))}
          {std !== '-' ? <> ± {formatNumberWithoutCommas(formatValue(std))}</> : ''}
          {fact.units || fact.unit && <> {fact.units || fact.unit}</>}
        </div>
      </div>
    );
  };

const FactsheetMapValueEntry: React.FC<{
  fact: FactsheetEntryType
}> = ({
  fact,
}) => {
    // @ts-ignore
    const maxVal = Math.max.apply(null, Object.values(fact.value_map).map(s => parseFloat(s as string)));
    const unitCode = fact.units || fact.unit;

    // @ts-ignore
    const valueColumn = Object.entries(fact.value_map).map(([label, value]) => {
      const barMaxFillRatio = 0.8;
      const barWidthPct = (parseFloat(value as string) / maxVal) * 100 * barMaxFillRatio;

      return (
        <div key={label} className="row mb-1">
          <div className="col-xs-6 pos-relative">
            {label}
            <div className="bar" style={{ width: `${barWidthPct}%` }} />
          </div>
          <div className="col-xs-6">
            <NumberFormat value={value} /> <Unit value={unitCode} />
          </div>
        </div>
      );
    });

    return (
      <div className="row mt-1">
        <div className="col-xs-6 col-lg-4 name">
          <Term term={fact.name} description={fact.description} />
        </div>
        <div className="col-xs-6 col-lg-8">{valueColumn}</div>
      </div>
    );
  };

const FactsheetEntry: React.FC<{
  fact: FactsheetEntryType
}> = ({
  fact
}) => {
    if (
      fact.value_map &&
      !isNil(fact.value_map.mean) &&
      !isNil(fact.value_map.std)
    ) {
      return (<FactsheetSingleMeanStdEntry fact={fact} />);
    }

    if (Array.isArray(fact.values)) {
      return (<FactsheetSingleMeanStdEntry fact={fact} />);
    }

    if (fact.value_map) {
      return (<FactsheetMapValueEntry fact={fact} />);
    }

    return (<FactsheetSingleValueEntry fact={fact} />);
  };

const Factsheet: React.FC<FactsheetProps> = ({
  facts,
  className = '',
}) => {
  return (
    <div className={`${classPrefix}basis ${className}`}>
      {facts.map((fact, index) => (
        <FactsheetEntry key={`${fact.name}-${index}`} fact={fact} />
      ))}
    </div>
  );
};

export default Factsheet;
