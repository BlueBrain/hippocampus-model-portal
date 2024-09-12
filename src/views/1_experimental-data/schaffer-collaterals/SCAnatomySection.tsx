import React, { useEffect, useState } from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import TextWithRefs from '@/components/TextWithRefs';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

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

type SCAnatomySectionProps = {
  theme?: number;
};

const SCAnatomySection: React.FC<SCAnatomySectionProps> = ({ theme }) => {
  const [anatomyData, setAnatomyData] = useState<TableEntry[]>([]);
  const [doiIndex, setDoiIndex] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const anatomyResponse = await fetch(`${dataPath}/1_experimental-data/schaffer-collaterals/sc-anatomy.json`);
      const anatomyJson = await anatomyResponse.json();
      setAnatomyData(anatomyJson);

      const doiResponse = await fetch(`${dataPath}/1_experimental-data/schaffer-collaterals/ref-doi.json`);
      const doiJson = await doiResponse.json();
      setDoiIndex(doiJson);
    };

    fetchData();
  }, []);

  const anatomyColumns = [
    {
      title: 'From',
      dataIndex: 'from' as keyof TableEntry,
    },
    {
      title: 'To',
      dataIndex: 'to' as keyof TableEntry,
    },
    {
      title: 'Exp. feature',
      dataIndex: 'expFeature' as keyof TableEntry,
    },
    {
      title: 'Min',
      dataIndex: 'min' as keyof TableEntry,
      render: (min: number) => <NumberFormat value={min} />
    },
    {
      title: 'Max',
      dataIndex: 'max' as keyof TableEntry,
      render: (max: number) => <NumberFormat value={max} />
    },
    {
      title: 'Mean',
      dataIndex: 'mean' as keyof TableEntry,
      render: (mean: number) => <NumberFormat value={mean} />
    },
    {
      title: 'SD',
      dataIndex: 'sd' as keyof TableEntry,
      render: (sd: number | string) => <NumberFormat value={sd} />
    },
    {
      title: 'SEM',
      dataIndex: 'sem' as keyof TableEntry,
      render: (sem: number | string) => <NumberFormat value={sem} />
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
      render: (text: string) => <TextWithRefs text={text} doiIndex={doiIndex} />
    },
  ];

  return (
    <>
      <ResponsiveTable<TableEntry>
        className="mt-3"
        data={anatomyData}
        columns={anatomyColumns}
        rowKey={({ from, to, mean }) => `${from}_${to}_${mean}`}
      />
      <div className="mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            anatomyData,
            `SC-Anatomy-Data.json`
          )}
        >
          SC Anatomy Data
        </DownloadButton>
      </div>
    </>
  );
};

export default SCAnatomySection;