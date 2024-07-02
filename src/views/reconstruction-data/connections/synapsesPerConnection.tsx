import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import SynapsesPerConnectionData from './synapses-per-conections.json';

type TableEntry = {
    Pathway: string;
    Convergence: string;
    BioMean: number;
    BioStd: number | null;
    BioN: number;
    ModMean: number;
    ModStd: number;
    ModN: number;
    ConnectionClass: string;
};

const transformData = (data: any): TableEntry[] => {
    const entries = data.values[0].value_map;
    return Object.keys(entries.pre).map(key => ({
        Pathway: `${entries.pre[key]}_${entries.post[key]}`,
        Convergence: entries.connection_class[key],
        BioMean: entries.bio_mean[key],
        BioStd: entries.bio_std[key],
        BioN: entries.bio_n[key],
        ModMean: entries.mod_mean[key],
        ModStd: entries.mod_std[key],
        ModN: entries.mod_n[key],
        ConnectionClass: entries.connection_class[key]
    }));
};

const SynapsesPerConnectionColumns = [
    {
        title: 'Pathway',
        dataIndex: 'Pathway' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'Convergence',
        dataIndex: 'Convergence' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'Bio Mean',
        dataIndex: 'BioMean' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'Bio Std',
        dataIndex: 'BioStd' as keyof TableEntry,
        render: (value: number | null) => <NumberFormat value={value} />
    },
    {
        title: 'Bio N',
        dataIndex: 'BioN' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'Mod Mean',
        dataIndex: 'ModMean' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'Mod Std',
        dataIndex: 'ModStd' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'Mod N',
        dataIndex: 'ModN' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'Connection Class',
        dataIndex: 'ConnectionClass' as keyof TableEntry,
    },
];

const SynapsesPerConnection: React.FC = () => {
    const data = transformData(SynapsesPerConnectionData);

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={data}
                columns={SynapsesPerConnectionColumns}
                rowKey={(record) => `${record.Pathway}_${record.Convergence}`}
            />
            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        data,
                        `SynapsesPerConnection-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>
        </>
    );
};

export default SynapsesPerConnection;