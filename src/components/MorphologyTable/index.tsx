import React, { useState, useMemo, useRef } from 'react';
import { Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { basePath } from '@/config';
import { graphTheme } from '@/constants';

type MorphologyData = {
    specimen_id: string;
    layer: string;
    mtype: string;
    morphology_id: string;
};

type MorphologyTableProps = {
    data: MorphologyData;
};

const MorphologyTable: React.FC<MorphologyTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;

    const tableRef = useRef<HTMLDivElement>(null);

    const columns = [
        {
            title: 'Layer',
            dataIndex: 'layer',
            key: 'layer',
            width: 100,
        },
        {
            title: 'M-type',
            dataIndex: 'mtype',
            key: 'mtype',
            width: 150,
        },
        {
            title: 'Morphology',
            dataIndex: 'morphology_id',
            key: 'morphology_id',
            width: 150,
            render: (morphology_id: string) => (
                <Link href={`${basePath}/}`}>
                    {morphology_id}
                </Link>
            ),
        },
        {
            title: 'Preview',
            dataIndex: 'morphology_id',
            key: 'preview',
            width: 220,
            render: (morphology_id: string) => (
                <Image

                    src={`${basePath}/images/1_experimental-data/neuronal-morphology/${morphology_id}.png`}
                    alt={`morphology preview ${morphology_id}`}
                    width={200}
                    height={100}
                    style={{ height: 'auto' }}
                />
            ),
        },
    ];

    const allTableData = useMemo(() => [
        {
            key: data.specimen_id,
            layer: data.layer,
            mtype: data.mtype,
            morphology_id: data.morphology_id,
        }
    ], [data]);

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

export default MorphologyTable;
