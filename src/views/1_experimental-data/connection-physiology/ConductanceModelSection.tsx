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
  sd?: number;
  sem?: number;
  species: string;
  age: string;
  weight?: string;
  region: string;
  nCells?: number;
  ref: string;
  ref_link?: string;
};

type DOIIndex = {
  [key: string]: string;
};

const Term = termFactory(mtypeDescription);

const ReversalPotentialColumns = [
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
    title: 'Mean, mV',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
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
    title: (<span>Reference<sup>*</sup></span>),
    dataIndex: 'ref' as keyof TableEntry,
    render: (text, record) =>
      record.ref_link ? (
        <a href={record.ref_link} target="_blank" rel="noopener noreferrer">{text}</a>
      ) : (
        text
      ),
  },
];

const PSPAmplitudeColumns = [
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
    title: 'Mean, mV',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
  },
  {
    title: 'SD, mV',
    dataIndex: 'sd' as keyof TableEntry,
    render: (sd) => <NumberFormat value={sd} />
  },
  {
    title: 'SEM, mV',
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
    render: (text, record) =>
      record.ref_link ? (
        <a href={record.ref_link} target="_blank" rel="noopener noreferrer">{text}</a>
      ) : (
        text
      ),
  },
];

const PSCAmplitudeColumns = [
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
    title: 'Mean, pA',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
  },
  {
    title: 'SD, pA',
    dataIndex: 'sd' as keyof TableEntry,
    render: (sd) => <NumberFormat value={sd} />
  },
  {
    title: 'SEM, pA',
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
    render: (text, record) =>
      record.ref_link ? (
        <a href={record.ref_link} target="_blank" rel="noopener noreferrer">{text}</a>
      ) : (
        text
      ),
  },
];

type ConductanceModelSectionProps = {
  theme?: number;
}

const ConductanceModelSection: React.FC<ConductanceModelSectionProps> = ({ theme }) => {
  const [reversalPotentialData, setReversalPotentialData] = useState<TableEntry[]>([]);
  const [PSPAmplitudeData, setPSPAmplitudeData] = useState<TableEntry[]>([]);
  const [PSCAmplitudeData, setPSCAmplitudeData] = useState<TableEntry[]>([]);

  useEffect(() => {
    fetch(`${dataPath}/1_experimental-data/connection-physiology/conductance_model_-_reversal_potential.json`)
      .then(response => response.json())
      .then(data => setReversalPotentialData(data));

    fetch(`${dataPath}/1_experimental-data/connection-physiology/conductance_model_-_psp_amplitude.json`)
      .then(response => response.json())
      .then(data => setPSPAmplitudeData(data));

    fetch(`${dataPath}/1_experimental-data/connection-physiology/conductance_model_-_psc_amplitude.json`)
      .then(response => response.json())
      .then(data => setPSCAmplitudeData(data));
  }, []);

  return (
    <>
      <h3 className="text-lg mb-2 mt-4">Reversal potential</h3>
      <ResponsiveTable<TableEntry>
        data={reversalPotentialData}
        columns={ReversalPotentialColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="mt-3">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(reversalPotentialData, `Reversal-Potential-Data.json`)}
        >
          Reversal potential Data
        </DownloadButton>
      </div>

      <h2 className="text-lg mb-2 mt-12">PSP amplitude</h2>
      <ResponsiveTable<TableEntry>
        data={PSPAmplitudeData}
        columns={PSPAmplitudeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(PSPAmplitudeData, `PSP-Amplitude-Data.json`)}
        >
          PSP amplitude
        </DownloadButton>
      </div>

      <h3 className="text-lg mb-2 mt-12">PSC amplitude</h3>
      <ResponsiveTable<TableEntry>
        data={PSCAmplitudeData}
        columns={PSCAmplitudeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(PSCAmplitudeData, `PSC-Amplitude-Data.json`)}
        >
          PSC amplitude
        </DownloadButton>
      </div>
    </>
  );
};

export default ConductanceModelSection;