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
    SliceThickness: string;
    Distance: string;
    n: number;
    N: number;
    p: number;
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
        title: 'Pre',
        dataIndex: 'Pre' as keyof DataEntry,
        render: pre => (<Term term={pre} description={getMtypeDescription(pre)} />),
    },
    {
        title: 'Post',
        dataIndex: 'Post' as keyof DataEntry,
        render: post => (<Term term={post} description={getMtypeDescription(post)} />),
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
    },
    {
        title: 'N',
        dataIndex: 'N' as keyof DataEntry,
    },
    {
        title: 'p',
        dataIndex: 'p' as keyof DataEntry,
        render: p => (<NumberFormat value={p} />),
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

type ConnectionProbabilityTableProps = {
    theme?: number;
}

const ConnectionProbabilityTable: React.FC<ConnectionProbabilityTableProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/connection-probability.json`)
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

            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Connection-Probability-Data.json`)}
                >
                    Connection Probability Data
                </DownloadButton>
            </div>
        </>
    );
};

export default ConnectionProbabilityTable;