import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import connectionProbabilityData from './connection-probability.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

type DataEntry = {
    mtype: string;
    Region: string;
    Specie: string;
    Age: string;
    Weight: string;
    mean: number;
    n_cells: number;
    std: number;
    SEM: number;
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
        mtype: "SP_PVBC",
        Region: "CA1",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "250-350 g",
        mean: 10436,
        n_cells: 4,
        std: 1393.26,
        SEM: 696.63,
        Reference: "Sik et al., 1995"
    },
    {
        mtype: "SP_BC",
        Region: "CA1",
        Specie: "Wistar rat",
        Age: "7-8 w",
        Weight: "-",
        mean: 10828,
        n_cells: 1,
        std: 0,
        SEM: 0,
        Reference: "Halasy et al., 1996"
    },
    {
        mtype: "SR_SCA",
        Region: "CA1",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "> 120 g",
        mean: 5998,
        n_cells: 1,
        std: 0,
        SEM: 0,
        Reference: "Vida et al., 1998"
    },
    {
        mtype: "SR_CCKBC",
        Region: "CA1",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "> 120 g",
        mean: 7964,
        n_cells: 1,
        std: 0,
        SEM: 0,
        Reference: "Vida et al., 1998"
    },
    {
        mtype: "SP_BS",
        Region: "CA1",
        Specie: "Sprague-Dawley / Wistar rat",
        Age: "7-8 w",
        Weight: "250-350 g",
        mean: 12676,
        n_cells: 2,
        std: 5549.37,
        SEM: 3924,
        Reference: "Sik et al., 1995; Halasy et al., 1996"
    },
    {
        mtype: "SO_OLM",
        Region: "CA1",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "250-350 g",
        mean: 16847,
        n_cells: 1,
        std: 0,
        SEM: 0,
        Reference: "Sik et al., 1995"
    },
    {
        mtype: "SLM_PPA",
        Region: "CA1",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "> 120 g",
        mean: 8015,
        n_cells: 1,
        std: 0,
        SEM: 0,
        Reference: "Vida et al., 1998"
    },
    {
        mtype: "SO_Tri",
        Region: "CA1",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "250-350 g",
        mean: 15767,
        n_cells: 1,
        std: 0,
        SEM: 0,
        Reference: "Sik et al., 1995"
    }
];
const columns = [
    {
        title: 'MType',
        dataIndex: 'mtype' as keyof DataEntry,
        render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />),
    },
    {
        title: 'Region',
        dataIndex: 'Region' as keyof DataEntry,
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
        title: 'Mean',
        dataIndex: 'mean' as keyof DataEntry,
    },
    {
        title: 'N. Cells',
        dataIndex: 'n_cells' as keyof DataEntry,
    },
    {
        title: 'STD',
        dataIndex: 'std' as keyof DataEntry,
    },
    {
        title: 'SEM',
        dataIndex: 'SEM' as keyof DataEntry,
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
    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
            />

            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        connectionProbabilityData,
                        `Synapse-Divergence-Per-Presynaptic-Type-Data.json`
                    )}
                >
                    Synapse Divergence Per Presynaptic Type Data
                </DownloadButton>
            </div>

        </>
    );
};


export default ConnectionProbabilityTable;
