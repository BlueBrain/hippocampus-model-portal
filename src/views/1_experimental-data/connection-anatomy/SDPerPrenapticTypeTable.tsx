import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    mtype: string;
    Region: string;
    Specie: string;
    Age: string;
    Weight: string;
    mean: number;
    n_cells: number;
    std: number;
    SEM: number;
    Reference: string;
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
        title: 'MType',
        dataIndex: 'mtype' as keyof DataEntry,
        render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />),
    },
    {
        title: 'Region',
        dataIndex: 'Region' as keyof DataEntry,
    },
    {
        title: 'Specie',
        dataIndex: 'Specie' as keyof DataEntry,
    },
    {
        title: 'Age',
        dataIndex: 'Age' as keyof DataEntry,
    },
    {
        title: 'Weight',
        dataIndex: 'Weight' as keyof DataEntry,
    },
    {
        title: 'Mean',
        dataIndex: 'mean' as keyof DataEntry,
    },
    {
        title: 'N. Cells',
        dataIndex: 'n_cells' as keyof DataEntry,
    },
    {
        title: 'STD',
        dataIndex: 'std' as keyof DataEntry,
    },
    {
        title: 'SEM',
        dataIndex: 'SEM' as keyof DataEntry,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof DataEntry,
        render: reference => (
            <a href="#" target="_blank" rel="noopener noreferrer">
                {reference}
            </a>
        ),
    }
];

type SDPerPresynapticTypeTableProps = {
    theme?: number;
}

const SDPerPresynapticTypeTable: React.FC<SDPerPresynapticTypeTableProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/sd-per-presynaptic-type.json`)
            .then((response) => response.json())
            .then((fetchedData) => setData(fetchedData));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Synapse-Divergence-Per-Presynaptic-Type-Data.json`)}
                >
                    Synapse Divergence Per Presynaptic Type Data
                </DownloadButton>
            </div>
        </>
    );
};

export default SDPerPresynapticTypeTable;