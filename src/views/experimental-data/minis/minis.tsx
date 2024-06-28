import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import MinisData from './minis.json';


type TableEntry = {
    preMtype: string;
    postMtype: string;
    ratAge: string;
    ca2: number | string;
    type: string;
    n: number;
    frequencyMean: number;
    frequencySEM: number;
    reference: string;
    notes: string;
};

const MinisColumns = [
    {
        title: 'Pre Mtype',
        dataIndex: 'preMtype' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'Post Mtype',
        dataIndex: 'postMtype' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'Rat Age',
        dataIndex: 'ratAge' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: '[Ca2+]',
        dataIndex: 'ca2' as keyof TableEntry,
        render: (ca2) => <NumberFormat value={ca2} />
    },
    {
        title: 'Type',
        dataIndex: 'type' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'n',
        dataIndex: 'n' as keyof TableEntry,
        render: (n) => <NumberFormat value={n} />
    },
    {
        title: 'Frequency Mean',
        dataIndex: 'frequencyMean' as keyof TableEntry,
        render: (frequencyMean) => <NumberFormat value={frequencyMean} />
    },
    {
        title: 'Frequency SEM',
        dataIndex: 'frequencySEM' as keyof TableEntry,
        render: (frequencySEM) => <NumberFormat value={frequencySEM} />
    },
    {
        title: 'Reference',
        dataIndex: 'reference' as keyof TableEntry,
    },
    {
        title: 'Notes',
        dataIndex: 'notes' as keyof TableEntry,
    },
];


const Minis: React.FC = () => {
    return (
        <>

            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={MinisData}
                columns={MinisColumns}
                rowKey={({ preMtype, postMtype, type }) => `${preMtype}_${postMtype}_${type}`}
            />
            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        MinisData,
                        `exp-minis-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>
        </>
    );
};

export default Minis;
