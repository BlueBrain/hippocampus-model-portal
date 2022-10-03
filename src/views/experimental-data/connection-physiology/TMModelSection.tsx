import React from 'react';

import NumberFormat from '@/components/NumberFormat';
import ResponsiveTable from '@/components/ResponsiveTable';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';
import { mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import PSCAmplitudeData from './tm_model_-_psc_amplitude.json';
import doiIndex from './ref-doi.json';
import { TableEntry } from './types';


const Term = termFactory(mtypeDescription);

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
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];

const TMModelSection: React.FC = () => {
  return (
    <>
      <p className="text-tmp mb-3">
        Qui numquam odit et mollitia quibusdam et dolore galisum At rerum obcaecati vel earum voluptatem vel
        voluptate omnis? Qui voluptas molestiae ut vero porro et ipsa dolor quo natus consequatur. In dolores
        vero non officiis explicabo cum galisum laborum in quasi velit id officiis molestiae eos voluptatum ducimus.
        Ad tempore maiores et internos iste At optio quae.
      </p>

      <h2>PSC amplitude</h2>
      <ResponsiveTable<TableEntry>
        data={PSCAmplitudeData}
        columns={PSCAmplitudeColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            PSCAmplitudeData,
            `exp-connection-physiology_-_tm-model_-_psc-amplitude-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default TMModelSection;
