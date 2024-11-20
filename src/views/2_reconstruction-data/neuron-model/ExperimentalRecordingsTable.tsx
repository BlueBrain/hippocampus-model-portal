import React, { useState, useMemo, useRef } from 'react';
import { Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { imagesPath } from '@/config';
import traces from '@/traces.json';
import { graphTheme } from '@/constants';

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
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;

    const tableRef = useRef<HTMLDivElement>(null);

    const columns = [
        {
            title: 'Electrophysiology',
            dataIndex: 'ephys_id',
            key: 'ephys_id',
            width: 150,
            render: (ephys_id: string, record: { etype: string }) => (
                <Link href={`/experimental-data/neuronal-electrophysiology/?etype=${record.etype}&etype_instance=${ephys_id}`}>
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
                    src={`${imagesPath}/2_neuron-models/trace-preview/${ephys_id}.png`}
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

    const allTableData = useMemo(() => data.ephys_ids.map((ephys_id) => ({
        key: ephys_id,
        etype: getEtypeForEphysId(ephys_id),
        ephys_id: ephys_id,
    })), [data.ephys_ids]);

    const totalEntries = allTableData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const currentTableData = useMemo(() => {
        const start = (currentPage - 1) * entriesPerPage;
        const end = start + entriesPerPage;
        return allTableData.slice(start, end);
    }, [allTableData, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <div ref={tableRef}>
                <Table
                    columns={columns}
                    dataSource={currentTableData}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </div>
            {totalEntries > entriesPerPage && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
            <style jsx>{`
                .pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                .pagination button {
                    margin: 0 5px;
                    padding: 5px 10px;
                    border: 1px solid #d9d9d9;
                    background-color: #fff;
                    cursor: pointer;
                    transition: all 0.3s;
                    border-radius: 2px;
                }
                .pagination button:hover {
                    color: #40a9ff;
                    border-color: #40a9ff;
                }
                .pagination button.active {
                    color: #fff;
                    background-color: ${graphTheme.blue};
                    border-color: ${graphTheme.blue};
                }
            `}</style>
        </>
    );
};

export default ExperimentalRecordingsTable;
