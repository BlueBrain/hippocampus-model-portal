import React, { useMemo } from 'react';
import { Table } from 'antd';

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
    title: 'Density, /mm³',
    dataIndex: 'density' as keyof CellComposition,
    render: density => <NumberFormat value={density} />
  },
  {
    title: 'N. cells',
    dataIndex: 'count' as keyof CellComposition,
    render: count => <NumberFormat value={count} />
  },
];

const CellCompositionTable: React.FC<CellCompositionTableProps> = ({ volumeSection }) => {
  const totalCount = useMemo(() => {
    return volumeSection
      ? cellCompositionData[volumeSection].reduce((sum, curr) => sum + curr.count, 0)
      : 0;
  }, [volumeSection]);

  return (
    <>
      <Table<CellComposition>
        className="mb-2"
        size="small"
        pagination={false}
        bordered
        columns={columns}
        dataSource={cellCompositionData[volumeSection]}
        rowKey={({ mtype }) => mtype}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={1} />
            <Table.Summary.Cell index={2}><strong><NumberFormat value={totalCount}/></strong></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
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
