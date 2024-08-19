import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

import { VolumeSection } from '@/types';
import { downloadAsJson } from '@/utils';
import NumberFormat from '@/components/NumberFormat';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import { dataPath } from '@/config';

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
        title: 'Species',
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
        render: (mean: number) => <NumberFormat value={mean} />,
    },
    {
        title: 'Number of Animals',
        dataIndex: 'n_animals',
        key: 'n_animals',
        render: (n_animals: number) => <NumberFormat value={n_animals} />,
    },
    {
        title: 'Standard Deviation',
        dataIndex: 'std',
        key: 'std',
        render: (std: number) => <NumberFormat value={std} />,
    },
    {
        title: 'SEM',
        dataIndex: 'SEM',
        key: 'SEM',
        render: (SEM: number) => <NumberFormat value={SEM} />,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference',
        key: 'Reference',
    },
];

type CellDensityTableProps = {
    theme?: number;
};

const CellDensityTable: React.FC<CellDensityTableProps> = ({ theme }) => {
    const [data, setData] = useState<CellDensity[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/cell-density/cell-density.json`)
            .then((response) => response.json())
            .then((fetchedData: CellDensity[]) => setData(fetchedData));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Table<CellDensity>
                className="mb-2"
                size="small"
                pagination={false}
                bordered
                columns={columns}
                dataSource={data}
                rowKey={({ Cell_type, Region }) => `${Cell_type}-${Region}`}
                summary={() => {
                    const totalAnimals = data.reduce((sum, record) => sum + record.n_animals, 0);
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

            <div className="text-right mt-4">
                <DownloadButton onClick={() => downloadAsJson(data, `Cell-Density-Data.json`)} theme={theme}>
                    Cell Density Data
                </DownloadButton>
            </div>
        </>
    );
};

export default CellDensityTable;