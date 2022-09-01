import React from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';

import synapsePhysiologyData from './sc-synaptic-physiology.json';
import doiIndex from './ref-doi.json';


type TableEntry = {
  expFeature: string;
  mean: number;
  sd: number | string;
  sem: number | string;
  species: string;
  ageWeight: string;
  region: string;
  nAnimals: number | string;
  nCells: number | string;
  ref: string;
}

const synapsePhysiologyColumns = [
  {
    title: 'Exp. feature',
    dataIndex: 'expFeature' as keyof TableEntry,
    width: 180,
  },
  {
    title: 'Mean',
    dataIndex: 'mean' as keyof TableEntry,
    render: (mean) => <NumberFormat value={mean} />,
    width: 50,
  },
  {
    title: 'SD',
    dataIndex: 'sd' as keyof TableEntry,
    render: (sd) => <NumberFormat value={sd} />,
    width: 50,
  },
  {
    title: 'SEM',
    dataIndex: 'sem' as keyof TableEntry,
    render: (sem) => <NumberFormat value={sem} />,
    width: 50,
  },
  {
    title: 'Unit',
    dataIndex: 'unit' as keyof TableEntry,
    width: 50,
  },
  {
    title: 'Species',
    dataIndex: 'species' as keyof TableEntry,
    width: 136,
  },
  {
    title: 'Age/Weight',
    dataIndex: 'ageWeight' as keyof TableEntry,
    width: 142,
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof TableEntry,
    width: 50,
  },
  {
    title: 'N cells',
    className: 'text-nowrap',
    dataIndex: 'nCells' as keyof TableEntry,
    width: 50,
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof TableEntry,
    render: (text) => <TextWithRefs text={text} doiIndex={doiIndex} />
  },
];

const SCSynapsePhysiologySection: React.FC = () => {
  return (
    <>
      <p className="text-tmp">
        Et quibusdam sunt et accusamus nihil aut officia alias vel galisum laudantium et consequatur adipisci ut
        sint quaerat? Aut mollitia excepturi id adipisci internos et aliquam repellat aut aperiam odit rem earum
        facere vel sequi consequatur ut soluta obcaecati. Non galisum accusantium ut iusto eius aut doloribus
        omnis eum quasi sint nam omnis aspernatur.
      </p>

      <h2 className="mt-3">SC → Exc</h2>

      <h3 className="mt-3">PSP Magnitude and Variability</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].PSPMagnitudeAndVariability}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3>PSP Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].PSPKinetics}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3>NMDA Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].NMDAKinetics}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3>Short Term Plasticity</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].ShortTermPlasticity}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h2>SC → Inh</h2>

      <h3 className="mt-3">PSC Magnitude</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].PSCMagnitude}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3>PSP Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].PSPKinetics}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3>NMDA Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].NMDAKinetics}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3>Short Term Plasticity</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].ShortTermPlasticity}
        columns={synapsePhysiologyColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            synapsePhysiologyData,
            `exp-schaffer-collaterals-synapse-physiology-table.json`
          )}
        >
          all table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default SCSynapsePhysiologySection;
