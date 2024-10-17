import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    "Neuron Type": string;
    "Dose (µM)": number;
    "Drug": string;
    "Region": string;
    "Layer": string;
    "Species": string;
    "Age": string;
    "Weight": string;
    "Vm_control (mV) mean": number;
    "Vm_control (mV) std": number | string;
    "Vm_ACh (mV) mean": number;
    "Vm_ACh (mV) std": number;
    "∆Vm (mV)": number;
    "Current (nA)": number;
    "n. cells": string;
    "ref_link": string;
};

// Define custom types to match ResponsiveTable's expectations
type ColumnType<T> = {
    title: string;
    dataIndex: keyof T | (string | number)[];
    key?: string;
    render?: (value: any, record: T, index: number) => React.ReactNode;
};

type GroupColumnType<T> = {
    title: string;
    children: ColumnType<T>[];
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

// Define columns using the custom types
const columns: (ColumnType<DataEntry> | GroupColumnType<DataEntry>)[] = [
    { title: 'Neuron Type', dataIndex: 'Neuron Type', key: 'neuronType' },
    { title: 'Dose (µM)', dataIndex: 'Dose (µM)', key: 'dose' },
    { title: 'Drug', dataIndex: 'Drug', key: 'drug' },
    { title: 'Region', dataIndex: 'Region', key: 'region' },
    { title: 'Layer', dataIndex: 'Layer', key: 'layer' },
    { title: 'Species', dataIndex: 'Species', key: 'species' },
    { title: 'Age', dataIndex: 'Age', key: 'age' },
    { title: 'Weight', dataIndex: 'Weight', key: 'weight' },
    {
        title: 'Vm_control (mV)',
        children: [
            {
                title: 'Mean',
                dataIndex: 'Vm_control (mV) mean',
                key: 'vmControlMean',
                render: (value: number) => value.toFixed(1)
            },
            {
                title: 'std',
                dataIndex: 'Vm_control (mV) std',
                key: 'vmControlStd',
                render: (value: number | string) => value === '-' ? value : Number(value).toFixed(1)
            },
        ],
    },
    {
        title: 'Vm_ACh (mV)',
        children: [
            {
                title: 'Mean',
                dataIndex: 'Vm_ACh (mV) mean',
                key: 'vmAChMean',
                render: (value: number) => value.toFixed(1)
            },
            {
                title: 'std',
                dataIndex: 'Vm_ACh (mV) std',
                key: 'vmAChStd',
                render: (value: number) => value.toFixed(1)
            },
        ],
    },
    {
        title: 'Current (nA)',
        dataIndex: '∆Vm (mV)',
        key: 'deltaVm',
        render: (value: number) => value.toFixed(2)
    },
    { title: 'N.Cell', dataIndex: 'Current (nA)', key: 'current' },
    {
        title: 'Reference',
        dataIndex: 'n. cells',
        render: (reference: string, record: DataEntry) => (
            <a href={record.ref_link} target="_blank" rel="noopener noreferrer">{reference}</a>
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
                rowKey={({ 'Neuron Type': neuronType, 'Dose (µM)': dose }) => `${neuronType}-${dose}`}
            />
            <div className="mt-4">
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