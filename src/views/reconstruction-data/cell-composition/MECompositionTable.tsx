import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription, etypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import MECompositionData from './me-composition.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';


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

const formatValue = value => value ? <NumberFormat value={value} suffix="%" /> : '-';

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof MEComposition,
    render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />)
  },
  {
    title: <Term term="cNAC" />,
    dataIndex: 'cNAC' as keyof MEComposition,
    render: value => formatValue(value),
  },
  {
    title: <Term term="cAC" />,
    dataIndex: 'cAC' as keyof MEComposition,
    render: value => formatValue(value),
  },
  {
    title: <Term term="bAC" />,
    dataIndex: 'bAC' as keyof MEComposition,
    render: value => formatValue(value),
  },
];

type MECompositionTableProps = {
  theme?: number;
};

const MECompositionTable: React.FC<MECompositionTableProps> = ({ theme }) => {
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

      <div className="text-right mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            MECompositionData,
            `ME-Composition-Table-Data.json`
          )}
        >
          ME Composition Table Data
        </DownloadButton>
      </div>
    </>
  );
};


export default MECompositionTable;
