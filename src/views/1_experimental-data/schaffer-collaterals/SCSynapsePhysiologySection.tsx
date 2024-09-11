import React, { useEffect, useState } from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';
import { termFactory } from '@/components/Term';
import { pathwayDescription } from '@/terms';

import { dataPath } from '@/config';


import DownloadButton from '@/components/DownloadButton';

const Term = termFactory(pathwayDescription);

type TableEntry = {
  expFeature: string;
  mean: number;
  sd: number | string;
  sem: number | string;
  species: string;
  age?: string;
  weight?: string;
  region: string;
  nAnimals: number | string;
  nCells: number | string;
  ref: string;
  unit: string;
}

type SynapsePhysiologyData = {
  'sc-exc': {
    PSPMagnitudeAndVariability: TableEntry[];
    PSPKinetics: TableEntry[];
    NMDAKinetics: TableEntry[];
    ShortTermPlasticity: TableEntry[];
  };
  'sc-inh': {
    PSCMagnitude: TableEntry[];
    PSPKinetics: TableEntry[];
    NMDAKinetics: TableEntry[];
    ShortTermPlasticity: TableEntry[];
  };
}

type SCSynapsePhysiologySectionProps = {
  theme?: number;
}

const SCSynapsePhysiologySection: React.FC<SCSynapsePhysiologySectionProps> = ({ theme }) => {
  const [synapsePhysiologyData, setSynapsePhysiologyData] = useState<SynapsePhysiologyData | null>(null);
  const [doiIndex, setDoiIndex] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const synapsePhysiologyResponse = await fetch(`${dataPath}/1_experimental-data/schaffer-collaterals/sc-synaptic-physiology.json`);
      const synapsePhysiologyJson = await synapsePhysiologyResponse.json();
      setSynapsePhysiologyData(synapsePhysiologyJson);

      const doiResponse = await fetch(`${dataPath}/1_experimental-data/schaffer-collaterals/ref-doi.json`);
      const doiJson = await doiResponse.json();
      setDoiIndex(doiJson);
    };

    fetchData();
  }, []);

  const synapsePhysiologyColumns = [
    {
      title: 'Exp. feature',
      dataIndex: 'expFeature' as keyof TableEntry,
      render: (feature: string) => (<Term term={feature} />),
      width: 180,
    },
    {
      title: 'Mean',
      dataIndex: 'mean' as keyof TableEntry,
      render: (mean: number) => <NumberFormat value={mean} />,
      width: 50,
    },
    {
      title: 'SD',
      dataIndex: 'sd' as keyof TableEntry,
      render: (sd: number | string) => <NumberFormat value={sd} />,
      width: 50,
    },
    {
      title: 'SEM',
      dataIndex: 'sem' as keyof TableEntry,
      render: (sem: number | string) => <NumberFormat value={sem} />,
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
      title: 'Age',
      dataIndex: 'age' as keyof TableEntry,
      width: 142,
    },
    {
      title: 'Weight',
      dataIndex: 'weight' as keyof TableEntry,
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
      render: (text: string) => <TextWithRefs text={text} doiIndex={doiIndex} />
    },
  ];

  const synapsePhysiologyWOWeightColumns = synapsePhysiologyColumns.filter(column => column.title !== 'Weight');
  const synapsePhysiologyWOAgeColumns = synapsePhysiologyColumns.filter(column => column.title !== 'Age');

  if (!synapsePhysiologyData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className='text-xl mt-12'>SC → Exc</h2>
      <h3 className="mt-3  mb-3 text-lg">PSP Magnitude and Variability</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].PSPMagnitudeAndVariability}
        columns={synapsePhysiologyWOAgeColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3 className='mt-3 text-lg'>PSP Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].PSPKinetics}
        columns={synapsePhysiologyWOAgeColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3 className='mt-3 text-lg'>NMDA Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].NMDAKinetics}
        columns={synapsePhysiologyWOWeightColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3 className='mt-3 text-lg'>Short Term Plasticity</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-exc'].ShortTermPlasticity}
        columns={synapsePhysiologyWOWeightColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h2 className='text-xl mt-12 mb-3'>SC → Inh</h2>

      <h3 className='text-xl'>PSC Magnitude</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].PSCMagnitude}
        columns={synapsePhysiologyWOWeightColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3 className='text-lg mt-10'>SP Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].PSPKinetics}
        columns={synapsePhysiologyWOWeightColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3 className='text-lg mt-10'>NMDA Kinetics</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].NMDAKinetics}
        columns={synapsePhysiologyWOWeightColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <h3 className='text-lg mt-10'>Short Term Plasticity</h3>
      <ResponsiveTable<TableEntry>
        className="mt-2 mb-3"
        data={synapsePhysiologyData['sc-inh'].ShortTermPlasticity}
        columns={synapsePhysiologyWOWeightColumns}
        rowKey={({ expFeature, mean }) => `${expFeature}_${mean}`}
      />

      <div className="mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            synapsePhysiologyData,
            `SC-Synapse-Physiology-Data.json`
          )}
        >
          SC Synapse Physiology Data
        </DownloadButton>
      </div>
    </>
  );
};

export default SCSynapsePhysiologySection;