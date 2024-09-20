import React from 'react';
import { Table } from 'antd';
import Link from 'next/link';

type ExperimentalRecordingsData = {
    specimen_id: string;
    specimen_type: string;
    morphology: string;
    mtype: string;
    etype: string;
    layer: string;
    ephys_ids: string[];
};

type ExperimentalRecordingsTableProps = {
    data: ExperimentalRecordingsData;
};

const ExperimentalRecordingsTable: React.FC<ExperimentalRecordingsTableProps> = ({ data }) => {
    const columns = [
        {
            title: 'Layer',
            dataIndex: 'layer',
            key: 'layer',
            width: 100, // Add a fixed width for responsiveness
        },
        {
            title: 'M-type',
            dataIndex: 'mtype',
            key: 'mtype',
            width: 100,
        },
        {
            title: 'E-type',
            dataIndex: 'etype',
            key: 'etype',
            width: 100,
        },
        {
            title: 'Morphology',
            dataIndex: 'morphology',
            key: 'morphology',
            width: 150,
        },
        {
            title: 'Electrophysiology',
            dataIndex: 'ephys_ids',
            key: 'ephys_ids',
            width: 200, // Ensure enough space for links
            render: (ephys_ids: string[]) => (
                <>
                    {ephys_ids.map((id) => (
                        <>
                            <Link key={id} href={`/experimental-data/neuronal-electrophysiology/?etype=${data.etype}&etype_instance=${id}`} rel="noopener noreferrer" className="mr-2">
                                <span
                                    key={id}
                                    className='inline-block mr-2 mb-1 px-2 py-1 rounded cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    onClick={() => handleDownload(id)}
                                >
                                    {id}
                                </span>
                            </Link>
                            <br />
                        </>
                    ))}
                </>
            ),
        },
    ];

    const tableData = [
        {
            key: '1',
            ...data,
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ x: 'max-content' }} // Makes the table horizontally scrollable
        />
    );
};

export default ExperimentalRecordingsTable;

function handleDownload(id: string): void {
    throw new Error('Function not implemented.');
}
