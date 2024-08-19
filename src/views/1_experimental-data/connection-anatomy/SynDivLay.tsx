import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    "m-type": string;
    Specie: string;
    Weight: string;
    SO: number;
    SP: number;
    SR: number;
    SLM: number;
    "n.neurons": number;
    "n.boutons": number;
    Reference: string;
};

const termDescription = {
    ...mtypeDescription,
    ...layerDescription,
};

const Term = termFactory(termDescription);

function getMtypeDescription(fullMtype: string | undefined) {
    if (!fullMtype) return null;
    const [layer, mtype] = fullMtype.split('_');
    return layerDescription[layer] && mtypeDescription[mtype]
        ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
        : null;
}

const columns = [
    {
        title: 'MType',
        dataIndex: 'm-type' as keyof DataEntry,
        render: (mtype: string) => (<Term term={mtype} description={getMtypeDescription(mtype)} />),
    },
    {
        title: 'Specie',
        dataIndex: 'Specie' as keyof DataEntry,
    },
    {
        title: 'Weight',
        dataIndex: 'Weight' as keyof DataEntry,
    },
    {
        title: 'SO',
        dataIndex: 'SO' as keyof DataEntry,
    },
    {
        title: 'SP',
        dataIndex: 'SP' as keyof DataEntry,
    },
    {
        title: 'SR',
        dataIndex: 'SR' as keyof DataEntry,
    },
    {
        title: 'SLM',
        dataIndex: 'SLM' as keyof DataEntry,
    },
    {
        title: 'N. Neurons',
        dataIndex: 'n.neurons' as keyof DataEntry,
    },
    {
        title: 'N. Boutons',
        dataIndex: 'n.boutons' as keyof DataEntry,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof DataEntry,
        render: (reference: string) => (
            <a href="#" target="_blank" rel="noopener noreferrer">
                {reference}
            </a>
        ),
    }
];

type SynDivLayProps = {
    theme?: number;
}

const SynDivLay: React.FC<SynDivLayProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/syn-div-lay.json`)
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
                rowKey={(record) => record['m-type']}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Percentage-of-synapse-divergence-per-layer-Data.json`)}
                >
                    Percentage Of Synapse Divergence Per Layer Data
                </DownloadButton>
            </div>
        </>
    );
};

export default SynDivLay;