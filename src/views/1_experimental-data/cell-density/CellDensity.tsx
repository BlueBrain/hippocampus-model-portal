import React, { useState, useEffect } from 'react';
import { FixedType } from 'rc-table/lib/interface';
import { dataPath } from "../../../config";

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';

type CellDensityEntry = {
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

const CellDensityColumns = [
    {
        title: 'Cell Type',
        dataIndex: 'Cell_type' as keyof CellDensityEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'Region',
        dataIndex: 'Region' as keyof CellDensityEntry,
    },
    {
        title: 'Species',
        dataIndex: 'Specie' as keyof CellDensityEntry,
    },
    {
        title: 'Age',
        dataIndex: 'Age' as keyof CellDensityEntry,
    },
    {
        title: 'Mean Density',
        dataIndex: 'mean' as keyof CellDensityEntry,
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'n',
        dataIndex: 'n_animals' as keyof CellDensityEntry,
    },
    {
        title: 'Std Dev',
        dataIndex: 'std' as keyof CellDensityEntry,
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'SEM',
        dataIndex: 'SEM' as keyof CellDensityEntry,
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof CellDensityEntry,
    },
];

type CellDensityTableProps = {
    theme?: number;
};

const CellDensityTable: React.FC<CellDensityTableProps> = ({ theme }) => {
    const [data, setData] = useState<CellDensityEntry[]>([]);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/cell-density/cell-density.json`)
            .then(response => response.json())
            .then(fetchedData => setData(fetchedData));
    }, []);

    if (!data.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResponsiveTable<CellDensityEntry>
                className="mt-3"
                data={data}
                columns={CellDensityColumns}
                scroll={{ x: true }}
            />

            <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(data, 'cell-density-data.json')} theme={theme}>
                    Download Cell Density Data
                </DownloadButton>
            </div>
        </>
    );
};

export default CellDensityTable;