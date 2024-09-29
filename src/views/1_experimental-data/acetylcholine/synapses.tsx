import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    "Pre Neuron Type": string;
    "Post Neuron Type": string;
    "Dose (µM)": number;
    "Drug": string;
    "Region": string;
    "Layer": string;
    "Species": string;
    "Age": string;
    "Weight": string;
    "PSP/PSC": string;
    "Ratio ACh/Control": string;
    "n. connections": number;
    "Reference": string;
    "Reference_link": string | null;
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
        title: 'Pre Neuron Type',
        dataIndex: 'Pre Neuron Type' as keyof DataEntry,
        render: pre => (<Term term={pre} description={getMtypeDescription(pre)} />),
    },
    {
        title: 'Post Neuron Type',
        dataIndex: 'Post Neuron Type' as keyof DataEntry,
        render: post => (<Term term={post} description={getMtypeDescription(post)} />),
    },
    {
        title: 'Species',
        dataIndex: 'Species' as keyof DataEntry,
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
        title: 'PSP/PSC',
        dataIndex: 'PSP/PSC' as keyof DataEntry,
    },
    {
        title: 'Ratio ACh/Control',
        dataIndex: 'Ratio ACh/Control' as keyof DataEntry,
    },
    {
        title: 'n. connections',
        dataIndex: 'n. connections' as keyof DataEntry,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference',
        render: (reference: string, record: DataEntry) =>
            record.Reference_link ? (
                <a href={record.Reference_link} target="_blank" rel="noopener noreferrer">{reference}</a>
            ) : (
                <>{reference}</>
            )
    },
];

type SynapsesProps = {
    theme?: number;
};

const Synapses: React.FC<SynapsesProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/acetylcholine/synapses.json`)
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
                rowKey={({ 'Pre Neuron Type': pre, 'Post Neuron Type': post }) => `${pre}-${post}`}
            />
            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Synapses-Data.json`)}
                >
                    Synapses Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Synapses;