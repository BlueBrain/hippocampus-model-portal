import React, { useMemo } from 'react';
import { Table } from 'antd';

import { VolumeSection } from '@/types';
import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import cellCompositionData from './cell-composition.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';


type CellCompositionTableProps = {
  volumeSection: VolumeSection;
  theme?: number;
};

type CellComposition = {
  mtype: string;
  density: number;
  count: number;
};

const termDescription = {
  ...mtypeDescription,
  ...layerDescription,
};

const Term = termFactory(termDescription);

function getMtypeDescription(fullMtype: string) {
  const [layer, mtype] = fullMtype.split('_');

  return layerDescription[layer] && mtypeDescription[mtype]
    ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
    : null;
}

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof CellComposition,
    render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />)
  },
  {
    title: 'Density, neurons/mm³',
    dataIndex: 'density' as keyof CellComposition,
    render: density => <NumberFormat value={density} />
  },
  {
    title: 'Number of cells',
    dataIndex: 'count' as keyof CellComposition,
    render: count => <NumberFormat value={count} />
  },
];

const CellCompositionTable: React.FC<CellCompositionTableProps> = ({ volumeSection, theme }) => {
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
            <Table.Summary.Cell index={2}><strong><NumberFormat value={totalCount} /></strong></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <div className="text-right mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            cellCompositionData[volumeSection],
            `Cell-Composition-Data-${volumeSection}.json`
          )}
        >
          Cell Composition Data
        </DownloadButton>
      </div>
    </>
  );
};


export default CellCompositionTable;
