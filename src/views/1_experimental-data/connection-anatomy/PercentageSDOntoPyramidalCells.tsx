import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    "m-type": string;
    Specie: string | null;
    Age: string | null;
    Weight: string | null;
    PC: number;
    INT: number;
    n: number | null;
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
        dataIndex: 'm-type' as keyof DataEntry,
        render: (mtype: string) => (
            <Term term={mtype} description={getMtypeDescription(mtype)} />
        ),
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
        title: 'PC',
        dataIndex: 'PC' as keyof DataEntry,
        render: (pc: number) => pc.toFixed(3),
    },
    {
        title: 'INT',
        dataIndex: 'INT' as keyof DataEntry,
        render: (int: number) => int.toFixed(3),
    },
    {
        title: 'N',
        dataIndex: 'n' as keyof DataEntry,
        render: (n: number | null) => (n !== null ? n : 'N/A'),
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof DataEntry,
        render: (reference: string, record: DataEntry) =>
            record.Reference_link ? (
                <a href={record.Reference_link} target="_blank" rel="noopener noreferrer">
                    {reference}
                </a>
            ) : (
                reference
            ),
    }
];

type PercentageSDOntoPyramidalCellsProps = {
    theme?: number;
}

const PercentageSDOntoPyramidalCells: React.FC<PercentageSDOntoPyramidalCellsProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);
    const [error, setError] = useState<string | null>(null); // State for handling errors

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/percentage-SD-onto-pyramidal-cells.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((fetchedData: DataEntry[]) => setData(fetchedData))
            .catch((error) => {
                console.error('Error fetching percentage SD data:', error);
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
                rowKey={(record, index) => `${record["m-type"]}-${index}`} // Ensure uniqueness
            />

            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Percentage-of-Synapse-Divergence-Onto-Pyramidal-Cells-And-Interneurons-Data.json`)}
                >
                    Percentage of synapse divergence onto pyramidal cells and interneurons
                </DownloadButton>
            </div>
        </>
    );
};

export default PercentageSDOntoPyramidalCells;