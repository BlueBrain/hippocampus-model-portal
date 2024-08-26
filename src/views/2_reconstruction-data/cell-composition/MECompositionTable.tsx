import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription, etypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

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

const formatValue = (value: number | null) => value !== null ? <NumberFormat value={value} suffix="%" /> : '-';

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
  const [data, setData] = useState<MEComposition[] | null>(null);

  useEffect(() => {
    fetch(dataPath + '/2_reconstruction-data/cell-composition/me-composition.json')
      .then((response) => response.json())
      .then((fetchedData) => setData(fetchedData));
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table<MEComposition>
        className="mb-2"
        size="small"
        bordered
        tableLayout="fixed"
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey={({ mtype }) => mtype}
      />

      <div className="text-right mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            data,
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