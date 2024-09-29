import React from 'react';
import { Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { basePath } from '@/config';
import traces from '@/traces.json';

type ExperimentalRecordingsData = {
    specimen_id: string;
    specimen_type: string;
    etype: string;
    ephys_ids: string[];
};

type ExperimentalRecordingsTableProps = {
    data: ExperimentalRecordingsData;
};

const ExperimentalRecordingsTable: React.FC<ExperimentalRecordingsTableProps> = ({ data }) => {
    const columns = [

        {
            title: 'Electrophysiology',
            dataIndex: 'ephys_id',
            key: 'ephys_id',
            width: 150,
            render: (ephys_id: string, record: { etype: string }) => (
                <Link href={`http://localhost:3000/hippocampus-portal-dev/experimental-data/neuronal-electrophysiology/?etype=${record.etype}&etype_instance=${ephys_id}`}>
                    {ephys_id}
                </Link>
            ),
        },
        {
            title: 'E-type',
            dataIndex: 'etype',
            key: 'etype',
            width: 100,
        },
        {
            title: 'Preview',
            dataIndex: 'ephys_id',
            key: 'preview',
            width: 220,
            render: (ephys_id: string) => (
                <Image
                    src={`${basePath}/data/images/2_neuron-models/trace-preview/${ephys_id}.png`}
                    alt={`neuron trace preview ${ephys_id}`}
                    width={200}
                    height={100}
                    style={{ height: 'auto' }}
                />
            ),
        },
    ];

    const getEtypeForEphysId = (ephysId: string): string => {
        for (const [etype, ids] of Object.entries(traces)) {
            if (ids.includes(ephysId)) {
                return etype;
            }
        }
        return 'Unknown';  // fallback if not found
    };

    const tableData = data.ephys_ids.map((ephys_id) => ({
        key: ephys_id,
        etype: getEtypeForEphysId(ephys_id),
        ephys_id: ephys_id,
    }));

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ x: 'max-content' }}
        />
    );
};

export default ExperimentalRecordingsTable;