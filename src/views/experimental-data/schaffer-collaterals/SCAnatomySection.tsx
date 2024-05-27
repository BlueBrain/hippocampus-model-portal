import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';

import anatomyData from './sc-anatomy.json';
import doiIndex from './ref-doi.json';


type TableEntry = {
  from: string;
  to: string;
  expFeature: string;
  min: number;
  max: number;
  mean: number;
  sd: number | string;
  sem: number | string;
  species: string;
  weight: string;
  region: string;
  nAnimals: number | string;
  nSynapses: number | string;
  ref: string;
};

const anatomyColumns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof TableEntry,
    fixed: 'left' as FixedType,
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof TableEntry,
    fixed: 'left' as FixedType,
  },
  {
    title: 'Exp. feature',
    dataIndex: 'expFeature' as keyof TableEntry,
    fixed: 'left' as FixedType,
  },
  {
    title: 'Min',
    dataIndex: 'min' as keyof TableEntry,
    render: (min) => <NumberFormat value={min} />
  },
  {
    title: 'Max',
    dataIndex: 'max' as keyof TableEntry,
    render: (max) => <NumberFormat value={max} />
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
    title: 'Weight',
    dataIndex: 'weight' as keyof TableEntry,
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
    title: 'N synapses',
    className: 'text-nowrap',
    dataIndex: 'nSynapses' as keyof TableEntry,
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];

const SCAnatomySection: React.FC = () => {
  return (
    <>
      <p>
        Here we report the anatomical measurements on the connectivity established by Schaffer collaterals with excitatory (Exc) and inhibitory (Inh) neurons in CA1.
      </p>

      <ResponsiveTable<TableEntry>
        className="mt-3"
        data={anatomyData}
        columns={anatomyColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            anatomyData,
            `exp-schaffer-collaterals-anatomy-table.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default SCAnatomySection;
