import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    "m-type": string;
    Species: string;
    Weight: string;
    SO: number;
    SP: number;
    SR: number;
    SLM: number;
    "n.neurons": number;
    "n.boutons": number;
    Reference: string;
    Reference_link?: string; // Optional field
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
        render: (mtype: string) => (
            <Term term={mtype} description={getMtypeDescription(mtype)} />
        ),
    },
    {
        title: 'Region',
        dataIndex: 'Region' as keyof DataEntry,
        render: (region: string) => region || 'N/A',
    },
    {
        title: 'Species',
        dataIndex: 'Species' as keyof DataEntry,
        render: (species: string) => species || 'N/A',
    },
    {
        title: 'Weight',
        dataIndex: 'Weight' as keyof DataEntry,
        render: (weight: string) => weight || 'N/A',
    },
    {
        title: 'SO',
        dataIndex: 'SO' as keyof DataEntry,
        render: (so: number) => so.toFixed(2),
    },
    {
        title: 'SP',
        dataIndex: 'SP' as keyof DataEntry,
        render: (sp: number) => sp.toFixed(2),
    },
    {
        title: 'SR',
        dataIndex: 'SR' as keyof DataEntry,
        render: (sr: number) => sr.toFixed(2),
    },
    {
        title: 'SLM',
        dataIndex: 'SLM' as keyof DataEntry,
        render: (slm: number) => slm.toFixed(2),
    },
    {
        title: 'N. Neurons',
        dataIndex: 'n.neurons' as keyof DataEntry,
        render: (nNeurons: number) => nNeurons,
    },
    {
        title: 'N. Boutons',
        dataIndex: 'n.boutons' as keyof DataEntry,
        render: (nBoutons: number) => nBoutons,
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof DataEntry,
        render: (reference: string, record: DataEntry) =>
            record.Reference_link && record.Reference_link.trim() !== '' ? (
                <a
                    href={record.Reference_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Reference: ${reference}`}
                >
                    {reference}
                </a>
            ) : (
                reference
            ),
    }
];

type SynDivLayProps = {
    theme?: number;
}

const SynDivLay: React.FC<SynDivLayProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);
    const [error, setError] = useState<string | null>(null); // State for handling errors

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/syn-div-lay.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((fetchedData: DataEntry[]) => setData(fetchedData))
            .catch((error) => {
                console.error('Error fetching syn-div-lay data:', error);
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
                    onClick={() => downloadAsJson(data, `Percentage-of-synapse-divergence-per-layer-Data.json`)}
                >
                    Percentage of synapse divergence per layer
                </DownloadButton>
            </div>
        </>
    );
};

export default SynDivLay;