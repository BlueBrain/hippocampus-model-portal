import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { dataPath } from '@/config';

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

const columns = [
    { title: 'Neuron Type', dataIndex: 'Neuron Type' },
    { title: 'Dose (µM)', dataIndex: 'Dose (µM)' },
    { title: 'Drug', dataIndex: 'Drug' },
    { title: 'Region', dataIndex: 'Region' },
    { title: 'Layer', dataIndex: 'Layer' },
    { title: 'Species', dataIndex: 'Species' },
    { title: 'Age', dataIndex: 'Age' },
    { title: 'Weight', dataIndex: 'Weight' },
    {
        title: 'Vm_control (mV)',
        children: [
            { title: 'Mean', dataIndex: ['Vm_control (mV)', 'mean'], render: (mean: number) => <>{mean}</> },
            { title: 'std', dataIndex: ['Vm_control (mV)', 'std'], render: (std: number | null) => <>{std !== null ? std : '-'}</> },
        ],
    },
    {
        title: 'Vm_ACh (mV)',
        children: [
            { title: 'Mean', dataIndex: ['Vm_ACh (mV)', 'mean'], render: (mean: number) => <>{mean}</> },
            { title: 'std', dataIndex: ['Vm_ACh (mV)', 'std'], render: (std: number | null) => <>{std !== null ? std : '-'}</> },
        ],
    },
    { title: '∆FR (Hz)', dataIndex: '∆FR (Hz)' },
    { title: 'Current (nA)', dataIndex: 'Current (nA)' },
    { title: 'n. cells', dataIndex: 'n. cells' },
    {
        title: 'Reference', dataIndex: 'Reference', render: (reference: string) => (
            <a href="#" target="_blank" rel="noopener noreferrer">{reference}</a>
        )
    },
];

type RestingMembranePotentialProps = {
    theme?: number;
};

const RestingMembranePotential: React.FC<RestingMembranePotentialProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/acetylcholine/resting-membrane-potential.json`)
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
                rowKey={({ 'Neuron Type': neuronType }) => neuronType}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Resting-Membrane-Potential-Data.json`)}
                >
                    Resting Membrane Potential Data
                </DownloadButton>
            </div>
        </>
    );
};

export default RestingMembranePotential;