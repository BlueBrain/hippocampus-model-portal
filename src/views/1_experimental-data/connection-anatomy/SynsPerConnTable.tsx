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
  mean: number | string;
  std: number | 'n/a' | string;
  nConns: number | string;
  sem: number | '-' | string;
  ref: string;
  ref_link?: string;
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
    render: (from: string) => (
      <Term term={from} description={getMtypeDescription(from)} />
    ),
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof DataEntry,
    render: (to: string) => (
      <Term term={to} description={getMtypeDescription(to)} />
    ),
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof DataEntry,
    render: (region: string) => region || 'N/A',
  },
  {
    title: 'Specie',
    dataIndex: 'specie' as keyof DataEntry,
    render: (specie: string) => specie || 'N/A',
  },
  {
    title: 'Age',
    dataIndex: 'age' as keyof DataEntry,
    render: (age?: string) => age || 'N/A',
  },
  {
    title: 'Weight',
    dataIndex: 'weight' as keyof DataEntry,
    render: (weight?: string) => weight || 'N/A',
  },
  {
    title: 'Synapses per connection',
    children: [
      {
        title: 'Mean ± std',
        dataIndex: 'mean' as keyof DataEntry,
        render: (mean: number | string, record: DataEntry) => (
          <>
            {typeof mean === 'number' ? <NumberFormat value={mean} /> : 'N/A'} ±{' '}
            {typeof record.std === 'number' ? <NumberFormat value={record.std} /> : 'N/A'}
          </>
        ),
      },
      {
        title: 'SEM',
        dataIndex: 'sem' as keyof DataEntry,
        render: (sem: number | '-' | string) => (
          typeof sem === 'number' ? <NumberFormat value={sem} /> : 'N/A'
        ),
      },
      {
        title: 'N. conns',
        dataIndex: 'nConns' as keyof DataEntry,
        render: (nConns: number | string) => (
          typeof nConns === 'number' ? nConns : 'N/A'
        ),
      },
    ],
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof DataEntry,
    render: (ref: string, record: DataEntry) =>
      record.ref_link && record.ref_link.trim() !== '' ? (
        <a
          href={record.ref_link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Reference: ${ref}`}
        >
          {ref}
        </a>
      ) : (
        ref
      ),
  },
];

type SynsPerConnTableProps = {
  theme?: number;
}

const SynsPerConnTable: React.FC<SynsPerConnTableProps> = ({ theme }) => {
  const [data, setData] = useState<DataEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null); // State for handling errors

  useEffect(() => {
    fetch(`${dataPath}/1_experimental-data/connection-anatomy/syns-per-conn.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData: DataEntry[]) => setData(fetchedData))
      .catch((error) => {
        console.error('Error fetching syns-per-conn data:', error);
        setError('Failed to load data.');
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ResponsiveTable<DataEntry>
        className="mb-2"
        columns={columns}
        data={data}
        rowKey={(record, index) => `${record.from}_${record.to}_${index}`} // Ensure uniqueness
      />
      <div className="mt-2">
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