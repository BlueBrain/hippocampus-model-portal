import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type DataEntry = {
    Species: string;
    Age: string;
    Weight: string;
    "Dose (µM)": number | string;
    Drug: string;
    Application: string;
    Region: string;
    Layer: string;
    "Slice Thickness (µm)": number | string;
    "ACSF (mM)": {
        Ca: number | string;
        Mg: number | string;
        K: number | string;
    };
    Measurement: string;
    Effects: string;
    "n slices": number | string;
    Reference: string;
    "Reference_link": string | null;
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
    { title: 'Species', dataIndex: 'Species' as keyof DataEntry },
    { title: 'Age', dataIndex: 'Age' as keyof DataEntry },
    { title: 'Weight', dataIndex: 'Weight' as keyof DataEntry },
    { title: 'Dose (µM)', dataIndex: 'Dose (µM)' as keyof DataEntry },
    { title: 'Drug', dataIndex: 'Drug' as keyof DataEntry },
    { title: 'Application', dataIndex: 'Application' as keyof DataEntry },
    { title: 'Region', dataIndex: 'Region' as keyof DataEntry },
    { title: 'Layer', dataIndex: 'Layer' as keyof DataEntry },
    { title: 'Slice Thickness (µm)', dataIndex: 'Slice Thickness (µm)' as keyof DataEntry },
    {
        title: 'ACSF (mM)',
        children: [
            { title: 'Ca', dataIndex: ['ACSF (mM)', 'Ca'], render: (Ca: number | string) => <>{Ca !== null ? Ca : '-'}</> },
            { title: 'Mg', dataIndex: ['ACSF (mM)', 'Mg'], render: (Mg: number | string) => <>{Mg !== null ? Mg : '-'}</> },
            { title: 'K', dataIndex: ['ACSF (mM)', 'K'], render: (K: number | string) => <>{K !== null ? K : '-'}</> },
        ],
    },
    { title: 'Measurement', dataIndex: 'Measurement' as keyof DataEntry },
    { title: 'Effects', dataIndex: 'Effects' as keyof DataEntry },
    { title: 'N Slices', dataIndex: 'n slices' as keyof DataEntry },
    {
        title: 'Reference',
        dataIndex: 'Reference',
        render: (reference: string, record: DataEntry) =>
            record.Reference_link ? (
                <a href={record.Reference_link} target="_blank" rel="noopener noreferrer">{reference}</a>
            ) : (
                <>{reference}</>
            )
    },
];

type NetworkProps = {
    theme?: number;
};

const Network: React.FC<NetworkProps> = ({ theme }) => {
    const [data, setData] = useState<DataEntry[] | null>(null);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/acetylcholine/network.json`)
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
                rowKey={(record) => record.Reference}
            />
            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(data, `Network-Data.json`)}
                >
                    Network Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Network;