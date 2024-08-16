import React from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';
import { mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import RatioData from './nmda_kinetics_-_nmda_ratio.json';
import TauDecayData from './nmda_kinetics_-_nmda_tau_decay.json';
import TauRiseData from './nmda_kinetics_-_nmda_tau_rise.json';
import doiIndex from './ref-doi.json';
import { TableEntry } from './types';
import DownloadButton from '@/components/DownloadButton/DownloadButton';


const Term = termFactory(mtypeDescription);

const RatioColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
    render: from => (<Term term={from} />),
  },
  {
    title: 'To',
    className: 'text-nowrap',
    dataIndex: 'to' as keyof TableEntry,
    render: to => (<Term term={to} />),
  },
  {
    title: 'Mean',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />
  },
  {
    title: 'SD, ms',
    className: 'text-nowrap',
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
    className: 'text-nowrap',
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
    title: 'N Animals',
    className: 'text-nowrap',
    dataIndex: 'nAnimals' as keyof TableEntry,
  },
  {
    title: 'N cells',
    className: 'text-nowrap',
    dataIndex: 'nCells' as keyof TableEntry,
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];

const TauDecayColumns = [
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
    title: 'N Animals',
    dataIndex: 'nAnimals' as keyof TableEntry,
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

const TauRiseColumns = [
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

type NMDAKineticsSectionProps = {
  theme?: number;
}

const NMDAKineticsSection: React.FC<NMDAKineticsSectionProps> = ({ theme }) => {
  return (
    <>
      <h3 className='text-lg mb-2'>NMDA/AMPA ratio</h3 >
      <ResponsiveTable<TableEntry>
        data={RatioData}
        columns={RatioColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            RatioData,
            `NMDAAMPA-Ratio-Data.json`
          )}
        >
          NMDA/AMPA ratio Data
        </DownloadButton>
      </div>

      <h3 className='text-lg mb-2 mt-12'>NMDA tau decay</h3 >
      <ResponsiveTable<TableEntry>
        data={TauDecayData}
        columns={TauDecayColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            TauDecayData,
            ` NMDA-Tau-Decay-Data.json`
          )}
        >
          NMDA tau decay Data
        </DownloadButton>
      </div>

      <h3 className=" text-lg  mt-12">NMDA tau rise</h3 >
      <ResponsiveTable<TableEntry>
        data={TauRiseData}
        columns={TauRiseColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            TauRiseData,
            `NMDA-Tau-Rise.json`
          )}
        >
          NMDA tau rise Data
        </DownloadButton>
      </div>
    </>
  );
};


export default NMDAKineticsSection;
