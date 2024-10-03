import React, { useEffect, useState } from 'react';
import { FixedType } from 'rc-table/lib/interface';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

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
    reference_link?: string;
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
        render: (reference: string, record: TableEntry) =>
            record.reference_link ? (
                <a href={record.reference_link} target="_blank" rel="noopener noreferrer">{reference}</a>
            ) : (
                reference
            ),
    },
    {
        title: 'Notes',
        dataIndex: 'notes' as keyof TableEntry,
    },
];

type MinisProps = {
    theme?: number;
};

const Minis: React.FC<MinisProps> = ({ theme }) => {

    const [minisData, setMinisData] = useState<TableEntry[]>([]);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/minis/minis.json`)
            .then(response => response.json())
            .then(data => setMinisData(data));
    }, []);

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={minisData}
                columns={MinisColumns}
                rowKey={({ preMtype, postMtype, type }) => `${preMtype}_${postMtype}_${type}`}
            />
            <div className="mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        minisData,
                        `Minis-Data.json`
                    )}
                >
                    Minis Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Minis;