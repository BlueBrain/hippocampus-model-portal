import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    "m-type": string;
    Specie: string;
    Age: string;
    Weight: string;
    PC: number;
    INT: number;
    n: number;
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
        dataIndex: 'm-type' as keyof DataEntry,
        render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />),
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
        title: 'PC',
        dataIndex: 'PC' as keyof DataEntry,
    },
    {
        title: 'INT',
        dataIndex: 'INT' as keyof DataEntry,
    },
    {
        title: 'N',
        dataIndex: 'n' as keyof DataEntry,
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

type PercentageSDOntoPyramidalCellsProps = {
    theme?: number;
}

const PercentageSDOntoPyramidalCells: React.FC<PercentageSDOntoPyramidalCellsProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/connection-anatomy/percentage-SD-onto-pyramidal-cells.json`)
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
                    onClick={() => downloadAsJson(data, `Percentage-of-Synapse-Divergence-Onto-Pyramidal-Cells-And-Interneurons-Data.json`)}
                >
                    Percentage of Synapse Divergence Onto Pyramidal Cells And Interneurons Data
                </DownloadButton>
            </div>
        </>
    );
};

export default PercentageSDOntoPyramidalCells;