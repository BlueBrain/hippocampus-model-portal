import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import networkData from './network.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

type DataEntry = {
    "Neuron Type": string;
    "Dose (µM)": number;
    "Drug": string;
    "Region": string;
    "Layer": string;
    "Species": string;
    "Age": string;
    "Weight": string | null;
    "FR control (Hz)": { mean: number; std: number | null };
    "FR ACh (Hz)": { mean: number; std: number | null };
    "∆FR (Hz)": number;
    "Current (nA)": number;
    "n. cells": number;
    "Reference": string;
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
        "Neuron Type": "OLM",
        "Dose (µM)": 10,
        "Drug": "Muscarine and ACh",
        "Region": "CA1",
        "Layer": "SO",
        "Species": "Mouse",
        "Age": "14-21 d",
        "Weight": null,
        "FR control (Hz)": { "mean": 20, "std": null },
        "FR ACh (Hz)": { "mean": 25, "std": null },
        "∆FR (Hz)": 5,
        "Current (nA)": 0.02,
        "n. cells": 43,
        "Reference": "Lawrence et al., 2006"
    },
    {
        "Neuron Type": "other ADP-containing",
        "Dose (µM)": 10,
        "Drug": "Muscarine and ACh",
        "Region": "CA1",
        "Layer": "SO",
        "Species": "Mouse",
        "Age": "14-21 d",
        "Weight": null,
        "FR control (Hz)": { "mean": 20, "std": null },
        "FR ACh (Hz)": { "mean": 37, "std": null },
        "∆FR (Hz)": 17,
        "Current (nA)": 0.12,
        "n. cells": 43,
        "Reference": "Lawrence et al., 2006"
    },
    {
        "Neuron Type": "PC",
        "Dose (µM)": 3,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "Adult",
        "Weight": null,
        "FR control (Hz)": { "mean": 6, "std": null },
        "FR ACh (Hz)": { "mean": 9, "std": null },
        "∆FR (Hz)": 3,
        "Current (nA)": 0.06,
        "n. cells": 4,
        "Reference": "Sheridan and Sutor, 1990"
    },
    {
        "Neuron Type": "CCKSCA",
        "Dose (µM)": 10,
        "Drug": "Muscarine",
        "Region": "CA1",
        "Layer": "SR",
        "Species": "Mouse",
        "Age": "15-20 d",
        "Weight": null,
        "FR control (Hz)": { "mean": 12.7, "std": 1.7 },
        "FR ACh (Hz)": { "mean": 32, "std": 1.9 },
        "∆FR (Hz)": 19.3,
        "Current (nA)": 0.07,
        "n. cells": 21,
        "Reference": "Cea-del Rio et al., 2011"
    }
];
const columns = [
    {
        title: 'Neuron Type',
        dataIndex: 'Neuron Type',
    },
    {
        title: 'Dose (µM)',
        dataIndex: 'Dose (µM)',
    },
    {
        title: 'Drug',
        dataIndex: 'Drug',
    },
    {
        title: 'Region',
        dataIndex: 'Region',
    },
    {
        title: 'Layer',
        dataIndex: 'Layer',
    },
    {
        title: 'Species',
        dataIndex: 'Species',
    },
    {
        title: 'Age',
        dataIndex: 'Age',
    },
    {
        title: 'Weight',
        dataIndex: 'Weight',
    },
    {
        title: 'FR control (Hz)',
        children: [
            {
                title: 'Mean',
                dataIndex: ['FR control (Hz)', 'mean'],
                render: (mean: number) => <>{mean}</>,
            },
            {
                title: 'std',
                dataIndex: ['FR control (Hz)', 'std'],
                render: (std: number | null) => <>{std !== null ? std : '-'}</>,
            },
        ],
    },
    {
        title: 'FR ACh (Hz)',
        children: [
            {
                title: 'Mean',
                dataIndex: ['FR ACh (Hz)', 'mean'],
                render: (mean: number) => <>{mean}</>,
            },
            {
                title: 'std',
                dataIndex: ['FR ACh (Hz)', 'std'],
                render: (std: number | null) => <>{std !== null ? std : '-'}</>,
            },
        ],
    },
    {
        title: '∆FR (Hz)',
        dataIndex: '∆FR (Hz)',
    },
    {
        title: 'Current (nA)',
        dataIndex: 'Current (nA)',
    },
    {
        title: 'n. cells',
        dataIndex: 'n. cells',
    },
    {
        title: 'Reference',
        dataIndex: 'Reference',
        render: (reference: string) => (
            <a href="#" target="_blank" rel="noopener noreferrer">
                {reference}
            </a>
        ),
    }
];


type FiringRateProps = {
    theme?: number;
};

const FiringRate: React.FC<FiringRateProps> = ({ theme }) => {
    return (
        <>
            <ResponsiveTable<DataEntry>

                className="mb-2"
                columns={columns}
                data={data}
                rowKey={(record) => record.Reference}
            />

            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        networkData,
                        `Firing-Rate-Data.json`
                    )}
                >
                    Firing Rate Data
                </DownloadButton>
            </div>

        </>
    );
};


export default FiringRate;
