import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import AnatomyData from './anatomy.json';

type TableEntry = {
    pathway: string;
    convergence: number;
};

const MinisColumns = [
    {
        title: 'pathway',
        dataIndex: 'Pathway' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'convergence',
        dataIndex: 'Convergence' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },

];


const Anatomy: React.FC = () => {
    return (
        <>

            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={AnatomyData}
                columns={MinisColumns}
                rowKey={({ pathway, convergence }) => `${pathway}_${convergence}`}
            />
            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        AnatomyData,
                        `anatomy-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>
        </>
    );
};

export default Anatomy;
