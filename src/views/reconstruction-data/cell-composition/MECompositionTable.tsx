import React from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';

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

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof MEComposition,
  },
  {
    title: 'cNAC',
    dataIndex: 'cNAC' as keyof MEComposition,
    render: value => value !== 0
      ? (<NumberFormat value={value} />)
      : '-'
  },
  {
    title: 'cAC',
    dataIndex: 'cAC' as keyof MEComposition,
    render: value => value !== 0
      ? (<NumberFormat value={value} />)
      : '-'
  },
  {
    title: 'bAC',
    dataIndex: 'bAC' as keyof MEComposition,
    render: value => value !== 0
      ? (<NumberFormat value={value} />)
      : '-'
  },
];


const MECompositionTable: React.FC = () => {
  return (
    <>
      <ResponsiveTable<MEComposition>
        className="mb-2"
        columns={columns}
        data={MECompositionData}
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
