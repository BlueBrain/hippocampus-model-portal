import React from 'react';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

// import './style.less';

const classPrefix = 'factsheet__';

const kgTypeMap = {
  'nsg:NeuronCount': {
    valuePath: 'count',
    labelPaths: ['mType', 'eType'],
  },
};

export type BrainSubregionFactsheetProps = {
  data?: any;
};

type FactsheetEntryBaseType = {
  name: string;
  description: string;
};

type FactsheetMapValueType = FactsheetEntryBaseType & {
  value: any[];
};

type FactsheetSingleValueType = FactsheetEntryBaseType & {
  value: string | number;
  unitCode: string;
};

type FactsheetEntryType = FactsheetEntryBaseType & {
  value: string | number | object[];
};

function formatNumber(num: number | string) {
  return isNumber(num) ? num.toLocaleString() : num || 'NA';
}

const FactsheetSingleValueEntry: React.FC<{
  fact: FactsheetSingleValueType;
}> = ({ fact }) => {
  const formattedValue = formatNumber(fact.value);

  return (
    <div className="row mt-1">
      <div className="col-xs-4 name">{fact.name}</div>
      <div className="col-xs-4 value">
        {formattedValue} {fact.unitCode}
      </div>
    </div>
  );
};

const FactsheetMapValueEntry: React.FC<{ fact: FactsheetMapValueType }> = ({
  fact,
}) => {
  // @ts-ignore
  const { valuePath, labelPaths } = kgTypeMap[fact['@type']];

  const maxVal = Math.max.apply(
    null,
    fact.value.map(curr => parseFloat(get(curr, `${valuePath}.value`))),
  );

  const valueColumn = fact.value.map(valueEntry => {
    const value = get(valueEntry, `${valuePath}.value`, '');
    const formattedValue = formatNumber(value);
    const unitCode = get(valueEntry, `${valuePath}.unitCode`, '');

    const label = labelPaths
      .map((labelPath: string) => get(valueEntry, `${labelPath}.label`))
      .find(Boolean);

    const barMaxFillRatio = 0.8;
    const barWidthPct = (value / maxVal) * 100 * barMaxFillRatio;

    return (
      <div className="row mb-1" key={label}>
        <div className="col-xs-6 pos-relative">
          {label}
          <div className="bar" style={{ width: `${barWidthPct}%` }} />
        </div>
        <div className="col-xs-6">
          {formattedValue} {unitCode}
        </div>
      </div>
    );
  });

  return (
    <div className="row mt-1">
      <div className="col-xs-4 name">{fact.name}</div>
      <div className="col-xs-8">{valueColumn}</div>
    </div>
  );
};

const FactsheetEntry: React.FC<{ fact: FactsheetEntryType }> = ({ fact }) => {
  return Array.isArray(fact.value) ? (
    <FactsheetMapValueEntry fact={fact as FactsheetMapValueType} />
  ) : (
    <FactsheetSingleValueEntry fact={fact as FactsheetSingleValueType} />
  );
};

const BrainSubregionFactsheet: React.FC<BrainSubregionFactsheetProps> = ({
  data,
}) => {
  const facts = get(data, 'fact', []);

  return (
    <div className={`${classPrefix}basis`}>
      {facts.map((fact: any) => (
        <FactsheetEntry key={fact.name} fact={fact} />
      ))}
    </div>
  );
};

export default BrainSubregionFactsheet;
