import React, { useMemo, useState, useEffect } from 'react';
import { Table } from 'antd';

import { VolumeSection } from '@/types';
import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import DownloadButton from '@/components/DownloadButton';

import { dataPath } from '@/config';

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
  const [data, setData] = useState<Record<VolumeSection, CellComposition[]> | null>(null);

  useEffect(() => {
    fetch(dataPath + '/2_reconstruction-data/cell-composition/cell-composition.json')
      .then((response) => response.json())
      .then((fetchedData) => setData(fetchedData));
  }, []);

  const totalCount = useMemo(() => {
    if (!data || !volumeSection) return 0;
    return data[volumeSection].reduce((sum, curr) => sum + curr.count, 0);
  }, [data, volumeSection]);

  if (!data || !volumeSection) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table<CellComposition>
        className="mb-2"
        size="small"
        pagination={false}
        bordered
        columns={columns}
        dataSource={data[volumeSection]}
        rowKey={({ mtype }) => mtype}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={1} />
            <Table.Summary.Cell index={2}><strong><NumberFormat value={totalCount} /></strong></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <div className="mt-4">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            data[volumeSection],
            `Cell-Composition-Data-${volumeSection}.json`
          )}
        >
          <span className='collapsible-property small'>{volumeSection}</span> Cell Composition
        </DownloadButton>
      </div>
    </>
  );
};

export default CellCompositionTable;