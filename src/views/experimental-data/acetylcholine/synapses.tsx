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
        "Pre Neuron Type": "SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "Adult",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "38%",
        "n. connections": 9,
        "Reference": "Dasari and Gulledge, 2011"
    },
    {
        "Pre Neuron Type": "PC/SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 0.01,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SLM and SR",
        "Species": "Sprague-Dawley rat",
        "Age": "5-10 w",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "100%",
        "n. connections": 5,
        "Reference": "Hasselmo and Schnell, 1994"
    },
    {
        "Pre Neuron Type": "PC/SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 0.1,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SLM and SR",
        "Species": "Sprague-Dawley rat",
        "Age": "5-10 w",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "96%",
        "n. connections": 5,
        "Reference": "Hasselmo and Schnell, 1994"
    },
    {
        "Pre Neuron Type": "PC/SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 1,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SLM and SR",
        "Species": "Sprague-Dawley rat",
        "Age": "5-10 w",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "81%",
        "n. connections": 5,
        "Reference": "Hasselmo and Schnell, 1994"
    },
    {
        "Pre Neuron Type": "PC/SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SLM and SR",
        "Species": "Sprague-Dawley rat",
        "Age": "5-10 w",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "74%",
        "n. connections": 5,
        "Reference": "Hasselmo and Schnell, 1994"
    },
    {
        "Pre Neuron Type": "PC/SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 100,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SLM and SR",
        "Species": "Sprague-Dawley rat",
        "Age": "5-10 w",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "47%",
        "n. connections": 13,
        "Reference": "Hasselmo and Schnell, 1994"
    },
    {
        "Pre Neuron Type": "PC/SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 500,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SLM and SR",
        "Species": "Sprague-Dawley rat",
        "Age": "5-10 w",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "0%",
        "n. connections": 5,
        "Reference": "Hasselmo and Schnell, 1994"
    },
    {
        "Pre Neuron Type": "MF",
        "Post Neuron Type": "PC",
        "Dose (µM)": 1,
        "Drug": "Muscarine",
        "Region": "CA3",
        "Layer": "-",
        "Species": "Rat",
        "Age": "-",
        "Weight": "100-200 g",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "100%",
        "n. connections": 19,
        "Reference": "Williams and Johnston, 1990"
    },
    {
        "Pre Neuron Type": "MF",
        "Post Neuron Type": "PC",
        "Dose (µM)": 1,
        "Drug": "Muscarine",
        "Region": "CA3",
        "Layer": "-",
        "Species": "Rat",
        "Age": "-",
        "Weight": "100-200 g",
        "PSP/PSC": "EPSC",
        "Ratio ACh/Control": "89%",
        "n. connections": 14,
        "Reference": "Williams and Johnston, 1990"
    },
    {
        "Pre Neuron Type": "MF",
        "Post Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Muscarine",
        "Region": "CA3",
        "Layer": "-",
        "Species": "Rat",
        "Age": "-",
        "Weight": "100-200 g",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "77%",
        "n. connections": 7,
        "Reference": "Williams and Johnston, 1990"
    },
    {
        "Pre Neuron Type": "MF",
        "Post Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Muscarine",
        "Region": "CA3",
        "Layer": "-",
        "Species": "Rat",
        "Age": "-",
        "Weight": "100-200 g",
        "PSP/PSC": "EPSC",
        "Ratio ACh/Control": "66%",
        "n. connections": 7,
        "Reference": "Williams and Johnston, 1990"
    },
    {
        "Pre Neuron Type": "FSBC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA3",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "15-23 d",
        "Weight": "-",
        "PSP/PSC": "IPSC",
        "Ratio ACh/Control": "30%",
        "n. connections": 16,
        "Reference": "Szabó et al., 2010"
    },
    {
        "Pre Neuron Type": "AAC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA3",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "15-23 d",
        "Weight": "-",
        "PSP/PSC": "IPSC",
        "Ratio ACh/Control": "27%",
        "n. connections": 16,
        "Reference": "Szabó et al., 2010"
    },
    {
        "Pre Neuron Type": "RSBC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA3",
        "Layer": "SP",
        "Species": "Mouse",
        "Age": "15-23 d",
        "Weight": "-",
        "PSP/PSC": "IPSC",
        "Ratio ACh/Control": "6%",
        "n. connections": 13,
        "Reference": "Szabó et al., 2010"
    },
    {
        "Pre Neuron Type": "SC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 5,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Wistar Rat",
        "Age": "14-18 d",
        "Weight": "-",
        "PSP/PSC": "EPSC",
        "Ratio ACh/Control": "32%",
        "n. connections": 11,
        "Reference": "De Sevilla et al., 2002"
    },
    {
        "Pre Neuron Type": "SCC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 0.1,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "Adult",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "96%",
        "n. connections": 12,
        "Reference": "Sheridan and Sutor, 1990"
    },
    {
        "Pre Neuron Type": "SCC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 0.3,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "Adult",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "83%",
        "n. connections": 12,
        "Reference": "Sheridan and Sutor, 1990"
    },
    {
        "Pre Neuron Type": "SCC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 1,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "Adult",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "60%",
        "n. connections": 12,
        "Reference": "Sheridan and Sutor, 1990"
    },
    {
        "Pre Neuron Type": "SCC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 3,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "Adult",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "30%",
        "n. connections": 12,
        "Reference": "Sheridan and Sutor, 1990"
    },
    {
        "Pre Neuron Type": "SCC",
        "Post Neuron Type": "PC",
        "Dose (µM)": 10,
        "Drug": "Carbachol",
        "Region": "CA1",
        "Layer": "SP",
        "Species": "Sprague-Dawley rat",
        "Age": "Adult",
        "Weight": "-",
        "PSP/PSC": "EPSP",
        "Ratio ACh/Control": "6%",
        "n. connections": 12,
        "Reference": "Sheridan and Sutor, 1990"
    }
];

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
        dataIndex: 'Reference' as keyof DataEntry,
        render: reference => (
            <a href="#" target="_blank" rel="noopener noreferrer">
                {reference}
            </a>
        ),
    }
];

const Synapses = () => {
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
                        `exp-connection-anatomy_-synapses.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>

        </>
    );
};


export default Synapses;
