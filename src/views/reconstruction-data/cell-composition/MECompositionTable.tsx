import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { layerDescription, mtypeDescription, etypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import MECompositionData from './me-composition.json';
import style from './me-composition-styles.module.scss';


type MEComposition = {
  mtype: string;
  cNAC: number;
  cAC: number;
  bAC: number;
};

const termDescription = {
  ...mtypeDescription,
  ...layerDescription,
  ...etypeDescription,
};

const Term = termFactory(termDescription);

function getMtypeDescription(fullMtype: string) {
  const [layer, mtype] = fullMtype.split('_');

  return layerDescription[layer] && mtypeDescription[mtype]
    ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
    : null;
}

const ValueBar = ({ value, barColor }) => {
  if (!value) return (<>-</>);

  return (
    <>
      <div className={style.valueContainer}>
        <NumberFormat value={value} suffix="%" />
      </div>

      <div
        className={style.barContainer}
        style={{
          backgroundColor: barColor,
          height: `${value}%`,
        }}
      />
    </>
  );
}

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof MEComposition,
    render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />)
  },
  {
    title: <Term term="cNAC" />,
    dataIndex: 'cNAC' as keyof MEComposition,
    render: value => <ValueBar value={value} barColor="#C9D7F8" />
  },
  {
    title: <Term term="cAC" />,
    dataIndex: 'cAC' as keyof MEComposition,
    render: value => <ValueBar value={value} barColor="#A7E2E3" />
  },
  {
    title: <Term term="bAC" />,
    dataIndex: 'bAC' as keyof MEComposition,
    render: value => <ValueBar value={value} barColor="#80CFA9" />
  },
];


const MECompositionTable: React.FC = () => {
  return (
    <>
      <Table<MEComposition>
        className="mb-2"
        size="small"
        bordered
        tableLayout="fixed"
        pagination={false}
        columns={columns}
        dataSource={MECompositionData}
        rowKey={({ mtype }) => mtype}
      />

      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            MECompositionData,
            `rec-data-cell-composition_-_me-composition.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default MECompositionTable;
