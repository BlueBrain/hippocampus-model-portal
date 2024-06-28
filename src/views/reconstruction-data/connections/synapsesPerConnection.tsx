import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import SynapsesPerConnectionData from './synapses-per-conections.json';

type TableEntry = {

};

const SynapsesPerConnectionColumns = [
    /*
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
    */
];


const SynapsesPerConnection: React.FC = () => {
    return (
        <>

            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={SynapsesPerConnectionData}
                columns={SynapsesPerConnectionColumns}
                rowKey={({ pathway, convergence }) => `${pathway}_${convergence}`}
            />
            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        SynapsesPerConnectionData,
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
