import React from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';

import { VolumeSection } from '@/types';
import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';

import cellCompositionData from './cell-composition.json';


type CellCompositionTableProps = {
  volumeSection: VolumeSection;
};

type CellComposition = {
  mtype: string;
  density: number;
  count: number;
};

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof CellComposition,
  },
  {
    title: 'Density',
    dataIndex: 'density' as keyof CellComposition,
    render: density => <NumberFormat value={density} />
  },
  {
    title: 'Cell count',
    dataIndex: 'count' as keyof CellComposition,
  },
];

const CellCompositionTable: React.FC<CellCompositionTableProps> = ({ volumeSection }) => {
  return (
    <>
      <ResponsiveTable<CellComposition>
        className="mb-2"
        columns={columns}
        data={cellCompositionData[volumeSection]}
        rowKey={({ mtype }) => mtype}
      />

      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            cellCompositionData[volumeSection],
            `rec-data-cell-composition_-_mtype-composition-${volumeSection}.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default CellCompositionTable;
