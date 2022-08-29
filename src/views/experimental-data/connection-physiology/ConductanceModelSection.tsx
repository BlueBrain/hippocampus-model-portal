import React from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import reversalPotentialData from './conductance_model_-_reversal_potential.json';
import PSPAmplitudeData from './conductance_model_-_psp_amplitude.json';
import PSPCVData from './conductance_model_-_psp_cv.json';
import { TableEntry } from './types';

const ReversalPotentialColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof TableEntry,
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
    title: 'Age / Weight',
    dataIndex: 'ageWeight' as keyof TableEntry,
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof TableEntry,
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
  },
];

const PSPAmplitudeColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof TableEntry,
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
    title: 'Age / Weight',
    dataIndex: 'ageWeight' as keyof TableEntry,
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
  },
];

const PSPCVColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof TableEntry,
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
    title: 'Age / Weight',
    dataIndex: 'ageWeight' as keyof TableEntry,
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
    </>
  );
};


export default ConductanceModelSection;
