import React, { useState, useEffect } from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import { downloadAsJson } from '@/utils';

import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

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

const PhysiologyColumns = [
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
}

const Physiology: React.FC<PhysiologyProps> = ({ theme }) => {
    const [data, setData] = useState<TableEntry[] | null>(null);

    useEffect(() => {
        fetch(dataPath + '/2_reconstruction-data/schaffer-collaterals/physiology.json')
            .then((response) => response.json())
            .then((fetchedData) => setData(fetchedData));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={data}
                columns={PhysiologyColumns}
                rowKey={(record) => `${record.ruleN}_${record.from}_${record.to}`}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        data,
                        `Physiology-table.json`
                    )}
                >
                    Physiology Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Physiology;
