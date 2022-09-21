import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';

import MECompositionData from './me-composition.json';


type MEComposition = {
  mtype: string;
  cNAC: number;
  cAC: number;
  bAC: number;
};

const formatValue = value => value !== 0
  ? (<NumberFormat value={value} suffix="%" />)
  : '-';

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof MEComposition,
  },
  {
    title: 'cNAC',
    dataIndex: 'cNAC' as keyof MEComposition,
    render: value => formatValue(value),
  },
  {
    title: 'cAC',
    dataIndex: 'cAC' as keyof MEComposition,
    render: value => formatValue(value),
  },
  {
    title: 'bAC',
    dataIndex: 'bAC' as keyof MEComposition,
    render: value => formatValue(value),
  },
];


const MECompositionTable: React.FC = () => {
  return (
    <>
      <Table<MEComposition>
        className="mb-2"
        size="small"
        bordered
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
