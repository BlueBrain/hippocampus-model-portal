import React, { useState, useMemo, useRef } from 'react';
import { Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { basePath } from '@/config';
import { graphTheme } from '@/constants';
import { useRouter } from 'next/router';

type ElectrophysiologyTableData = {
    etype: string;
    ephys_ids: string[];
};

type ElectrophysiologyTableTableProps = {
    data: ElectrophysiologyTableData;
};

const ElectrophysiologyTable: React.FC<ElectrophysiologyTableTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;
    const router = useRouter();

    const tableRef = useRef<HTMLDivElement>(null);

    const columns = [
        {
            title: 'Electrophysiology',
            dataIndex: 'ephys_id',
            key: 'ephys_id',
            width: 150,
            render: (ephys_id: string) => (
                <Link
                    href={`/experimental-data/neuronal-electrophysiology/?etype=${data.etype}&etype_instance=${ephys_id}`}
                    onClick={(e) => handleClick(e, data.etype, ephys_id)}
                >
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

    const allTableData = useMemo(() => {
        if (!data) {
            console.error('Data is undefined or null');
            return [];
        }
        if (!Array.isArray(data.ephys_ids)) {
            console.error('data.ephys_ids is not an array:', data.ephys_ids);
            return [];
        }
        return data.ephys_ids.map((ephys_id) => ({
            key: ephys_id,
            etype: data.etype || 'Unknown',
            ephys_id: ephys_id,
        }));
    }, [data]);

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

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, etype: string, ephys_id: string) => {
        e.preventDefault();
        router.push(`/experimental-data/neuronal-electrophysiology/?etype=${etype}&etype_instance=${ephys_id}`, undefined, { shallow: true });

        // Scroll to DataContainer after a short delay to ensure the component has updated
        setTimeout(() => {
            const dataContainer = document.querySelector('.data-container');
            if (dataContainer) {
                dataContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <>
            {!data ? (
                <div>Loading data...</div>
            ) : allTableData.length === 0 ? (
                <div>No data available</div>
            ) : (
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
                </>
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

export default ElectrophysiologyTable;
