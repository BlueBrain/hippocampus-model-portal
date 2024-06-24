import React from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';
import { mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import PSCRiseTimeData from './ampa_kinetics_-_psc_rise_time.json';
import PSCTauDecayData from './ampa_kinetics_-_psc_tau_decay.json';
import doiIndex from './ref-doi.json';
import { TableEntry } from './types';


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
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
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
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];

const AMPAKineticsSection: React.FC = () => {
  return (
    <>
      <p className="mb-3">
        PSC shows a specific rise and decay which depends on the synapse and the set of synaptic receptors. The rise time are usually measured as the time taken by the PSC trace to go from 10% to 90% of its amplitude, while the time constant of the decay (tau decay) is estimated fitting an exponential decay function (e-t/decay) after the PSC peak and identifying its time constant. When slow receptors (i.e. NMDA and GABAB) are inactive or blocked in the experiments, the measures are due to mainly the fast receptors, AMPA or GABAA, respectively for excitatory or inhibitory synapses.
      </p>

      <h2>PSC rise time</h2>
      <ResponsiveTable<TableEntry>
        data={PSCRiseTimeData}
        columns={PSCRiseTimeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            PSCRiseTimeData,
            `exp-connection-physiology_-_ampa-kinetics_-_psc-rise-time-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>

      <h2 className="mt-3">PSC tau decay</h2>
      <ResponsiveTable<TableEntry>
        data={PSCTauDecayData}
        columns={PSCTauDecayColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            PSCTauDecayData,
            `exp-connection-physiology_-_ampa-kinetics_-_psc-tau-decay-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default AMPAKineticsSection;
