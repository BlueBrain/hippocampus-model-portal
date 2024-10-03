import React, { useState, useEffect } from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';
import { mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type TableEntry = {
  from: string;
  to: string;
  mean: number;
  sd: number;
  sem: number;
  species: string;
  age: string;
  weight: string;
  region: string;
  nCells: number;
  ref: string;
  ref_link?: string;
};

type DOIIndex = {
  [key: string]: string;
};

const Term = termFactory(mtypeDescription);

const PSCRiseTimeColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
    render: from => (<Term term={from} />),
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof TableEntry,
    render: to => (<Term term={to} />),
  },
  {
    title: 'Mean, ms',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
  },
  {
    title: 'SD, ms',
    dataIndex: 'sd' as keyof TableEntry,
    render: (sd) => <NumberFormat value={sd} />
  },
  {
    title: 'SEM, ms',
    dataIndex: 'sem' as keyof TableEntry,
    render: (sem) => <NumberFormat value={sem} />
  },
  {
    title: 'Species',
    dataIndex: 'species' as keyof TableEntry,
  },
  {
    title: 'Age',
    dataIndex: 'age' as keyof TableEntry,
  },
  {
    title: 'Weight',
    dataIndex: 'weight' as keyof TableEntry,
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof TableEntry,
  },
  {
    title: 'N cells',
    dataIndex: 'nCells' as keyof TableEntry,
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
    render: (reference: string, record: TableEntry) =>
      record.ref_link ? (
        <a href={record.ref_link} target="_blank" rel="noopener noreferrer">{reference}</a>
      ) : (
        reference
      ),
  },
];

const PSCTauDecayColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
    render: from => (<Term term={from} />),
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof TableEntry,
    render: to => (<Term term={to} />),
  },
  {
    title: 'Mean, ms',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
  },
  {
    title: 'SD, ms',
    dataIndex: 'sd' as keyof TableEntry,
    render: (sd) => <NumberFormat value={sd} />
  },
  {
    title: 'SEM, ms',
    dataIndex: 'sem' as keyof TableEntry,
    render: (sem) => <NumberFormat value={sem} />
  },
  {
    title: 'Species',
    dataIndex: 'species' as keyof TableEntry,
  },
  {
    title: 'Age',
    dataIndex: 'age' as keyof TableEntry,
  },
  {
    title: 'Weight',
    dataIndex: 'weight' as keyof TableEntry,
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof TableEntry,
  },
  {
    title: 'N cells',
    dataIndex: 'nCells' as keyof TableEntry,
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
    render: (reference: string, record: TableEntry) =>
      record.ref_link ? (
        <a href={record.ref_link} target="_blank" rel="noopener noreferrer">{reference}</a>
      ) : (
        reference
      ),
  },
];

type AMPAKineticsSectionProps = {
  theme?: number;
};

const AMPAKineticsSection: React.FC<AMPAKineticsSectionProps> = ({ theme }) => {
  const [PSCRiseTimeData, setPSCRiseTimeData] = useState<TableEntry[]>([]);
  const [PSCTauDecayData, setPSCTauDecayData] = useState<TableEntry[]>([]);

  useEffect(() => {
    fetch(`${dataPath}/1_experimental-data/connection-physiology/ampa_kinetics_-_psc_rise_time.json`)
      .then(response => response.json())
      .then(data => setPSCRiseTimeData(data));

    fetch(`${dataPath}/1_experimental-data/connection-physiology/ampa_kinetics_-_psc_tau_decay.json`)
      .then(response => response.json())
      .then(data => setPSCTauDecayData(data));
  }, []);

  return (
    <>
      <h3 className="text-lg mb-2 mt-4">PSC rise time</h3>
      <ResponsiveTable<TableEntry>
        data={PSCRiseTimeData}
        columns={PSCRiseTimeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="mt-2">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(PSCRiseTimeData, `PSC-Rise-Time-Data.json`)}
        >
          PSC rise time
        </DownloadButton>
      </div>

      <h3 className="text-lg mb-2 mt-12">PSC tau decay</h3>
      <ResponsiveTable<TableEntry>
        data={PSCTauDecayData}
        columns={PSCTauDecayColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="mt-2">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(PSCTauDecayData, `PSC-Tau-Decay-Data.json`)}
        >
          PSC tau decay
        </DownloadButton>
      </div>
    </>
  );
};

export default AMPAKineticsSection;