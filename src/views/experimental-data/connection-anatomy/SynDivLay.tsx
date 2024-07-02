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
    mtype: string;
    Specie: string;
    Weight: string;
    SO: number;
    SP: number;
    SR: number;
    SLM: number;
    n_neurons: number;
    n_boutons: number;
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
        mtype: "SP_BS",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 47.6,
        SP: 9.85,
        SR: 42.55,
        SLM: 0,
        n_neurons: 2,
        n_boutons: 8070,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SO_BS",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 48.1,
        SP: 12.4,
        SR: 39.5,
        SLM: 0,
        n_neurons: 1,
        n_boutons: 2027,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SP_CCKBC",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 29.4,
        SP: 62.85,
        SR: 7.75,
        SLM: 0,
        n_neurons: 2,
        n_boutons: 3036,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SR_CCKBC",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 9.1,
        SP: 57.7,
        SR: 31.75,
        SLM: 1.45,
        n_neurons: 2,
        n_boutons: 1878,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SR_Tri",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 27,
        SP: 23,
        SR: 50,
        SLM: 0,
        n_neurons: 1,
        n_boutons: 649,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SR_SCA",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 0,
        SP: 0.2,
        SR: 97.4,
        SLM: 2.4,
        n_neurons: 1,
        n_boutons: 4137,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SLM_PPA",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 0,
        SP: 0,
        SR: 37.7,
        SLM: 62.3,
        n_neurons: 1,
        n_boutons: 891,
        Reference: "Pawelzik et al., 2002"
    },
    {
        mtype: "SO_Tri",
        Specie: "Sprague-Dawley rat",
        Weight: "120-200 g",
        SO: 58.12,
        SP: 18.11,
        SR: 23.77,
        SLM: 0,
        n_neurons: 1,
        n_boutons: 4627,
        Reference: "Unpublished data from A. Thomson"
    }
];

const columns = [
    {
        title: 'MType',
        dataIndex: 'mtype' as keyof DataEntry,
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
        dataIndex: 'n_neurons' as keyof DataEntry,
    },
    {
        title: 'N. Boutons',
        dataIndex: 'n_boutons' as keyof DataEntry,
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

const ConnectionProbabilityTable = () => {
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
                        `exp-connection-anatomy_-_sd-per-trenaptic-type-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>

        </>
    );
};


export default ConnectionProbabilityTable;
