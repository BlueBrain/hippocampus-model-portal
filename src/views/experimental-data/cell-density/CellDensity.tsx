import React, { useMemo } from 'react';
import { Table } from 'antd';

import { VolumeSection } from '@/types';
import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import cellDensityData from './cell-denstiy.json';  // Import the JSON data

type CellDensityTableProps = {
    volumeSection: VolumeSection;
};

type CellDensity = {
    Cell_type: string;
    Region: string;
    Specie: string;
    Age: string;
    mean: number;
    n_animals: number;
    std: number;
    SEM: number;
    Reference: string;
};

const columns = [
    {
        title: 'Cell Type',
        dataIndex: 'Cell_type',
        key: 'Cell_type',
    },
    {
        title: 'Region',
        dataIndex: 'Region',
        key: 'Region',
    },
    {
        title: 'Specie',
        dataIndex: 'Specie',
        key: 'Specie',
    },
    {
        title: 'Age',
        dataIndex: 'Age',
        key: 'Age',
    },
    {
        title: 'Mean (10^3/mm^3)',
        dataIndex: 'mean',
        key: 'mean',
        render: mean => <NumberFormat value={mean} />,
    },
    {
        title: 'Number of Animals',
        dataIndex: 'n_animals',
        key: 'n_animals',
        render: n_animals => <NumberFormat value={n_animals} />,
    },
    {
        title: 'Standard Deviation',
        dataIndex: 'std',
        key: 'std',
        render: std => <NumberFormat value={std} />,
    },
    {
        title: 'SEM',
        dataIndex: 'SEM',
        key: 'SEM',
        render: SEM => <NumberFormat value={SEM} />,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference',
        key: 'Reference',
    },
];

const CellDensityTable: React.FC<CellDensityTableProps> = () => {
    const dataSource = useMemo(() => cellDensityData, []);

    return (
        <>
            <Table<CellDensity>
                className="mb-2"
                size="small"
                pagination={false}
                bordered
                columns={columns}
                dataSource={dataSource}
                rowKey={({ Cell_type, Region }) => `${Cell_type}-${Region}`}
                summary={() => {
                    const totalAnimals = dataSource.reduce((sum, record) => sum + record.mean, 0);
                    return (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} />
                            <Table.Summary.Cell index={2} />
                            <Table.Summary.Cell index={3} />
                            <Table.Summary.Cell index={4} />
                            <Table.Summary.Cell index={5}><strong><NumberFormat value={totalAnimals} /></strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={6} />
                            <Table.Summary.Cell index={7} />
                            <Table.Summary.Cell index={8} />
                        </Table.Summary.Row>
                    );
                }}
            />

            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        dataSource,
                        `cell-density-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>
        </>
    );
};

export default CellDensityTable;