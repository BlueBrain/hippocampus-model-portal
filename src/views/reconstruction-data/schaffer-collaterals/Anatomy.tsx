import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import PhysiologyData from './physiology.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

type TableEntry = {
    ruleN: number;
    from: string;
    to: string;
    ruleType: string;
    u: string;
    d: string;
    f: string;
    nrrp: number;
    hillScaling: number;
    gsyn: string;
    triseAMPA: number;
    tdecayAMPA: string;
    triseNMDA: number;
    tdecayNMDA: number;
    NMDAAMPARatio: number;
};

const PhysiolgyColumns = [
    {
        title: 'Rule N',
        dataIndex: 'ruleN' as keyof TableEntry,
    },
    {
        title: 'From',
        dataIndex: 'from' as keyof TableEntry,
    },
    {
        title: 'To',
        dataIndex: 'to' as keyof TableEntry,
    },
    {
        title: 'Rule Type',
        dataIndex: 'ruleType' as keyof TableEntry,
    },
    {
        title: 'U',
        dataIndex: 'u' as keyof TableEntry,
    },
    {
        title: 'D',
        dataIndex: 'd' as keyof TableEntry,
    },
    {
        title: 'F',
        dataIndex: 'f' as keyof TableEntry,
    },
    {
        title: 'NRRP',
        dataIndex: 'nrrp' as keyof TableEntry,
    },
];

type PhysiologyProps = {
    theme?: number;
};

const Anatomy: React.FC<PhysiologyProps> = ({ theme }) => {
    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={PhysiologyData}
                columns={PhysiolgyColumns}
                rowKey={(record) => `${record.ruleN}_${record.from}_${record.to}`}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        PhysiologyData,
                        `Anatomy-Data.json`
                    )}
                >
                    Download Anatomy Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Anatomy;