import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    Pre: string;
    Post: string;
    Specie: string;
    Age: string;
    Weight: string;
    "Slice thickness": string;
    Distance: string;
    n: number | string;
    N: number | string;
    p: number | string;
    Reference: string;
    Reference_link?: string; // Ensure this is included
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
        title: 'Pre',
        dataIndex: 'Pre' as keyof DataEntry,
        render: (pre: string) => (
            <Term term={pre} description={getMtypeDescription(pre)} />
        ),
    },
    {
        title: 'Post',
        dataIndex: 'Post' as keyof DataEntry,
        render: (post: string) => (
            <Term term={post} description={getMtypeDescription(post)} />
        ),
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
        title: 'Slice thickness',
        dataIndex: 'Slice thickness' as keyof DataEntry,
    },
    {
        title: 'Distance',
        dataIndex: 'Distance' as keyof DataEntry,
    },
    {
        title: 'n',
        dataIndex: 'n' as keyof DataEntry,
        render: (n: number | string) => n,
    },
    {
        title: 'N',
        dataIndex: 'N' as keyof DataEntry,
        render: (N: number | string) => N,
    },
    {
        title: 'p',
        dataIndex: 'p' as keyof DataEntry,
        render: (p: number | string) =>
            typeof p === 'number' ? <NumberFormat value={p} /> : p,
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
    },
];

type ConnectionProbabilityTableProps = {
    theme?: number;
}

const ConnectionProbabilityTable: React.FC<ConnectionProbabilityTableProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);
    const [error, setError] = useState<string | null>(null); // Optional: For error handling

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/connection-probability.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((fetchedData) => setData(fetchedData))
            .catch((error) => {
                console.error('Error fetching connection probability data:', error);
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
                rowKey={(record) => `${record.Pre}-${record.Post}-${record.Specie}-${record.Reference}`} // Ensure uniqueness
            />

            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Connection-Probability-Data.json`)}
                >
                    Connection probability
                </DownloadButton>
            </div>
        </>
    );
};

export default ConnectionProbabilityTable;