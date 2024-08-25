import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
  from: string;
  to: string;
  region: string;
  specie: string;
  age?: string;
  weight?: string;
  mean: number;
  std: number | 'n/a';
  n: number;
  sem: number | '-';
  reference: string | React.ReactNode;
};

const termDescription = {
  ...mtypeDescription,
  ...layerDescription,
};

const Term = termFactory(termDescription);

function getMtypeDescription(fullMtype: string) {
  const [layer, mtype] = fullMtype.split('_');
  return layerDescription[layer] && mtypeDescription[mtype]
    ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
    : null;
}

const columns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof DataEntry,
    render: from => (<Term term={from} description={getMtypeDescription(from)} />),
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof DataEntry,
    render: to => (<Term term={to} description={getMtypeDescription(to)} />),
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof DataEntry,
  },
  {
    title: 'Specie',
    dataIndex: 'specie' as keyof DataEntry,
  },
  {
    title: 'Age',
    dataIndex: 'age' as keyof DataEntry,
  },
  {
    title: 'Weight',
    dataIndex: 'weight' as keyof DataEntry,
  },
  {
    title: 'Synapses per connection',
    children: [
      {
        title: 'Mean ± std',
        dataIndex: 'mean' as keyof DataEntry,
        render: (mean, record) => <><NumberFormat value={mean} /> ± <NumberFormat value={record.std} /></>
      },
      {
        title: 'SEM',
        dataIndex: 'sem' as keyof DataEntry,
        render: (sem) => (<NumberFormat value={sem} />),
      },
      {
        title: 'N. conns',
        dataIndex: 'nConns' as keyof DataEntry,
      },
    ],
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof DataEntry,
  }
];

type SynsPerConnTableProps = {
  theme?: number;
}

const SynsPerConnTable: React.FC<SynsPerConnTableProps> = ({ theme }) => {
  const [data, setData] = useState<DataEntry[] | null>(null);

  useEffect(() => {
    fetch(`${dataPath}/1_experimental-data/connection-anatomy/syns-per-conn.json`)
      .then((response) => response.json())
      .then((fetchedData) => setData(fetchedData));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ResponsiveTable<DataEntry>
        className="mb-2"
        columns={columns}
        data={data}
        rowKey={({ from, to }) => `${from}_${to}`}
      />
      <div className="text-right mt-2">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(data, `exp-connection-anatomy_-_syns-per-conn-table.json`)}
        >
          Number of synapses per connection Data
        </DownloadButton>
      </div>
    </>
  );
};

export default SynsPerConnTable;