import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import connectionProbabilityData from './connection-probability.json';

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


const data: DataEntry[] = [
    {
        "m-type": "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "250-350 g",
        PC: 42.151,
        INT: 57.849,
        n: 130,
        Reference: "Takacs et al., 2012"
    },
    {
        "m-type": "OLM",
        Specie: "Wistar rat",
        Age: "2 m",
        Weight: "-",
        PC: 89.157,
        INT: 10.843,
        n: 34,
        Reference: "Katona et al., 1999"
    },
    {
        "m-type": "Tri",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "300-400 g",
        PC: 40,
        INT: 60,
        n: 52,
        Reference: "Ferraguti et al., 2005"
    },
    {
        "m-type": "AA",
        Specie: "-",
        Age: "-",
        Weight: "-",
        PC: 100,
        INT: 0,
        n: 0,
        Reference: "AA.VV."
    }
];

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


const PercentageSDOntoPyramidalCells = () => {
    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
            //rowKey={({ from, to }) => `${from}_${to}`}
            />

            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        connectionProbabilityData,
                        `exp-connection-anatomy_-_percentage-SD-onto-pyramidal-cells.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>

        </>
    );
};


export default PercentageSDOntoPyramidalCells;
