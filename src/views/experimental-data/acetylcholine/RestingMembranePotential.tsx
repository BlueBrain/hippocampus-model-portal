import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import networkData from './network.json';

type DataEntry = {
    "Neuron Type": string;
    "Dose (µM)": number;
    "Drug": string;
    "Region": string;
    "Layer": string;
    "Species": string;
    "Age": string;
    "Weight": string | null;
    "Vm_control (mV)": { mean: number; std: number | null };
    "Vm_ACh (mV)": { mean: number; std: number | null };
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
        "Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "Adult",
        "Weight": null,
        "Vm_control (mV)": { "mean": -79, "std": null },
        "Vm_ACh (mV)": { "mean": 2.5, "std": null },
        "∆FR (Hz)": -75.4,
        "Current (nA)": 3.6,
        "n. cells": 13,
        "Reference": "Dasari and Gulledge, 2011"
    },
    {
        "Neuron Type": "FSBC (PVBC)",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA3",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "15-23 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -65, "std": null },
        "Vm_ACh (mV)": { "mean": -58.9, "std": null },
        "∆FR (Hz)": 6.1,
        "Current (nA)": 0.17,
        "n. cells": 8,
        "Reference": "Szabó et al., 2010"
    },
    {
        "Neuron Type": "AAC",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA3",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "15-23 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -65, "std": null },
        "Vm_ACh (mV)": { "mean": -61.4, "std": null },
        "∆FR (Hz)": 3.6,
        "Current (nA)": 0.07,
        "n. cells": 11,
        "Reference": "Szabó et al., 2010"
    },
    {
        "Neuron Type": "RSBC",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA3",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "15-23 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -65, "std": null },
        "Vm_ACh (mV)": { "mean": -58.7, "std": null },
        "∆FR (Hz)": 6.3,
        "Current (nA)": 0.13,
        "n. cells": 7,
        "Reference": "Szabó et al., 2010"
    },
    {
        "Neuron Type": "INTs",
        "Dose (µM)": 10,
        "Drug": "Carbachol and ACh",
        "Region": "CA1",
        "Layer": "all",
        "Species": "Mouse",
        "Age": "18-25 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -70, "std": null },
        "Vm_ACh (mV)": { "mean": -55.5, "std": null },
        "∆FR (Hz)": 14.5,
        "Current (nA)": 0.37,
        "n. cells": 102,
        "Reference": "McQuiston and Madison, 1999"
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
        "Vm_control (mV)": { "mean": -66, "std": null },
        "Vm_ACh (mV)": { "mean": -61, "std": null },
        "∆FR (Hz)": 5,
        "Current (nA)": 0.16,
        "n. cells": 4,
        "Reference": "Sheridan and Sutor, 1990"
    },
    {
        "Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "10-40 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -61.3, "std": null },
        "Vm_ACh (mV)": { "mean": -56, "std": null },
        "∆FR (Hz)": 5.3,
        "Current (nA)": 0.17,
        "n. cells": 12,
        "Reference": "Palacios-Filardo et al., 2021"
    },
    {
        "Neuron Type": "PC",
        "Dose (µM)": 1,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Wistar rat",
        "Age": "13-15 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -75, "std": null },
        "Vm_ACh (mV)": { "mean": -72.4, "std": null },
        "∆FR (Hz)": 2.6,
        "Current (nA)": 0.09,
        "n. cells": 8,
        "Reference": "Buchanan et al., 2010"
    },
    {
        "Neuron Type": "PC",
        "Dose (µM)": 50,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "11-28 d",
        "Weight": null,
        "Vm_control (mV)": { "mean": -72, "std": null },
        "Vm_ACh (mV)": { "mean": -65, "std": null },
        "∆FR (Hz)": 7,
        "Current (nA)": 0.23,
        "n. cells": 9,
        "Reference": "Williams and Kauer, 1997"
    },
    {
        "Neuron Type": "PC",
        "Dose (µM)": 100,
        "Drug": "Carbachol",
        "Region": "SUB",
        "Layer": "all",
        "Species": "Sprague-Dawley rat",
        "Age": "-",
        "Weight": "200-300 g",
        "Vm_control (mV)": { "mean": -62.2, "std": null },
        "Vm_ACh (mV)": { "mean": -53.2, "std": null },
        "∆FR (Hz)": 9,
        "Current (nA)": 0.3,
        "n. cells": 9,
        "Reference": "Kawasaki and Avoli, 1996"
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
        title: 'Vm_control (mV)',
        children: [
            {
                title: 'Mean',
                dataIndex: ['Vm_control (mV)', 'mean'],
                render: (mean: number) => <>{mean}</>,
            },
            {
                title: 'std',
                dataIndex: ['Vm_control (mV)', 'std'],
                render: (std: number | null) => <>{std !== null ? std : '-'}</>,
            },
        ],
    },
    {
        title: 'Vm_ACh (mV)',
        children: [
            {
                title: 'Mean',
                dataIndex: ['Vm_ACh (mV)', 'mean'],
                render: (mean: number) => <>{mean}</>,
            },
            {
                title: 'std',
                dataIndex: ['Vm_ACh (mV)', 'std'],
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



const FiringRate = () => {
    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
                rowKey={({ from, to }) => `${from}_${to}`}
            />

            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        networkData,
                        `exp-connection-anatomy_-_resting-membrane-potential.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>

        </>
    );
};


export default FiringRate;
