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
    Specie: string | null;
    Age: string | null;
    Weight: string | null;
    mean: number;
    n_cells: number | null;
    std: number;
    SEM: number;
    Reference: string;
    Reference_link?: string; // Optional field
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
        render: (mtype: string) => (
            <Term term={mtype} description={getMtypeDescription(mtype)} />
        ),
    },
    {
        title: 'Region',
        dataIndex: 'Region' as keyof DataEntry,
    },
    {
        title: 'Specie',
        dataIndex: 'Specie' as keyof DataEntry,
        render: (specie: string | null) => specie || 'N/A',
    },
    {
        title: 'Age',
        dataIndex: 'Age' as keyof DataEntry,
        render: (age: string | null) => age || 'N/A',
    },
    {
        title: 'Weight',
        dataIndex: 'Weight' as keyof DataEntry,
        render: (weight: string | null) => weight || 'N/A',
    },
    {
        title: 'Mean',
        dataIndex: 'mean' as keyof DataEntry,
        render: (mean: number) => <NumberFormat value={mean} />,
    },
    {
        title: 'N. Cells',
        dataIndex: 'n_cells' as keyof DataEntry,
        render: (n_cells: number | null) => (n_cells !== null ? n_cells : 'N/A'),
    },
    {
        title: 'STD',
        dataIndex: 'std' as keyof DataEntry,
        render: (std: number) => <NumberFormat value={std} />,
    },
    {
        title: 'SEM',
        dataIndex: 'SEM' as keyof DataEntry,
        render: (sem: number) => <NumberFormat value={sem} />,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof DataEntry,
        render: (reference: string, record: DataEntry) =>
            record.Reference_link ? (
                record.Reference_link.trim() !== "" ? (
                    <a href={record.Reference_link} target="_blank" rel="noopener noreferrer">
                        {reference}
                    </a>
                ) : (
                    reference
                )
            ) : (
                reference
            ),
    }
];

type SDPerPresynapticTypeTableProps = {
    theme?: number;
}

const SDPerPresynapticTypeTable: React.FC<SDPerPresynapticTypeTableProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);
    const [error, setError] = useState<string | null>(null); // State for handling errors

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/sd-per-presynaptic-type.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((fetchedData: DataEntry[]) => setData(fetchedData))
            .catch((error) => {
                console.error('Error fetching Synapse Divergence data:', error);
                setError('Failed to load data.');
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
                rowKey={(record, index) => `${record.mtype}-${index}`} // Ensure uniqueness
            />
            <div className="mt-4">
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