import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import PhysiologyData from './physiology.json';

type TableEntry = {
    pathway: string;
    convergence: number;
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
        title: 'ruleN',
        dataIndex: 'ruleN' as keyof TableEntry,
    },
    {
        title: 'from',
        dataIndex: 'from' as keyof TableEntry,
    },
    {
        title: 'to',
        dataIndex: 'to' as keyof TableEntry,
    },
    {
        title: 'ruleType',
        dataIndex: 'ruleType' as keyof TableEntry,
    },
    {
        title: 'u',
        dataIndex: 'u' as keyof TableEntry,
    },
    {
        title: 'd',
        dataIndex: 'd' as keyof TableEntry,
    },
    {
        title: 'f',
        dataIndex: 'f' as keyof TableEntry,
    },
    {
        title: 'nrrp',
        dataIndex: 'nrrp' as keyof TableEntry,
    },
];


const Anatomy: React.FC = () => {
    return (
        <>

            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={PhysiologyData}
                columns={PhysiolgyColumns}

                x§            />
            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        PhysiologyData,
                        `physiology-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>
        </>
    );
};

export default Anatomy;
