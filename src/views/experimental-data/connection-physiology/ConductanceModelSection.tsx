import React from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';
import TextWithRefs from '@/components/TextWithRefs';
import { mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import reversalPotentialData from './conductance_model_-_reversal_potential.json';
import PSPAmplitudeData from './conductance_model_-_psp_amplitude.json';
import PSPCVData from './conductance_model_-_psp_cv.json';
import PSCAmplitudeData from './conductance_model_-_psc_amplitude.json';

import doiIndex from './ref-doi.json';
import { TableEntry } from './types';


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
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
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
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];

const PSPCVColumns = [
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
    title: 'Mean',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
  },
  {
    title: 'SD',
    dataIndex: 'sd' as keyof TableEntry,
    render: (sd) => <NumberFormat value={sd} />
  },
  {
    title: 'SEM',
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
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
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
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];


const ConductanceModelSection: React.FC = () => {
  return (
    <>
      <p className="text-tmp mb-3">
        Id voluptas esse et laboriosam cumque qui natus nobis. Quo aperiam dignissimos At fuga galisum aut
        blanditiis voluptatem aut autem culpa eos voluptate voluptatem non laborum cumque eos quia harum. Non
        deserunt iusto ex asperiores beatae et sint voluptas nam fuga excepturi et sint ullam et beatae nostrum
        rem error aliquam.
      </p>

      <h2>Reversal potential</h2>
      <ResponsiveTable<TableEntry>
        data={reversalPotentialData}
        columns={ReversalPotentialColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            reversalPotentialData,
            `exp-connection-physiology_-_conductance_model_-_reversal-potential-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>

      <h2 className="mt-3">PSP Amplitude</h2>
      <ResponsiveTable<TableEntry>
        data={PSPAmplitudeData}
        columns={PSPAmplitudeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            PSPAmplitudeData,
            `exp-connection-physiology_-_conductance_model_-_psp-amplitude-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>

      <h2 className="mt-3">PSP CV</h2>
      <ResponsiveTable<TableEntry>
        data={PSPCVData}
        columns={PSPCVColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            PSPCVData,
            `exp-connection-physiology_-_conductance_model_-_psp-cv-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>

      <h2 className="mt-3">PSC amplitude</h2>
      <ResponsiveTable<TableEntry>
        data={PSCAmplitudeData}
        columns={PSCAmplitudeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            PSCAmplitudeData,
            `exp-connection-physiology_-_conductance_model_-_psc-amplitude-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default ConductanceModelSection;
