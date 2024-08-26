import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { basePath } from "../../../config";
import ResponsiveTable from '@/components/ResponsiveTable';
import Link from 'next/link';
import DownloadButton from '@/components/DownloadButton';

type TableEntry = {
    name: string;
    contribution: {
        names: string[];
        institution: string;
    };
};

type NeuronTableProps = {
    data: TableEntry | TableEntry[] | null;
    layer?: string | string[];
    mtype?: string | string[];
    nameLink?: boolean,
    theme?: number
};

const NeuronTable: React.FC<NeuronTableProps> = ({ data, layer, mtype, nameLink, theme }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const tableRef = useRef<HTMLDivElement>(null);

    const validatedData = useMemo(() => {
        if (!data) {
            console.error('No data provided to NeuronTable');
            return [];
        }

        const dataArray = Array.isArray(data) ? data : [data];

        return dataArray.filter((entry): entry is TableEntry =>
            entry &&
            typeof entry === 'object' &&
            'name' in entry &&
            'contribution' in entry &&
            typeof entry.contribution === 'object' &&
            'names' in entry.contribution &&
            Array.isArray(entry.contribution.names) &&
            'institution' in entry.contribution
        );
    }, [data]);

    const totalEntries = validatedData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * entriesPerPage;
        const end = start + entriesPerPage;
        return validatedData.slice(start, end);
    }, [validatedData, currentPage]);

    if (validatedData.length === 0) {
        return <div>No valid data available</div>;
    }

    const morphHref = (morphologyName: string) => {
        const params = new URLSearchParams();
        if (layer) params.set('layer', Array.isArray(layer) ? layer[0] : layer);
        if (mtype) params.set('mtype', Array.isArray(mtype) ? mtype[0] : mtype);
        params.set('instance', morphologyName);
        return `/experimental-data/neuronal-morphology-new/?${params.toString()}#data`;
    };

    const downloadHref = (fileUrl) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'downloadedFile.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const NeuronTableColumns = [
        {
            title: 'Preview',
            dataIndex: 'name',
            className: 'preview-column',
            render: (name: string) => (
                <div className="image-container">
                    <Image
                        src={`${basePath}/resources/images/1_experimental-data/neuronal-morphology/${name}.png`}
                        alt={`neuron image ${name}`}
                        width={300}
                        height={187}
                        style={{ width: '300px', height: 'auto' }}
                    />
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (name: string) => (
                nameLink ? (
                    <Link href={morphHref(name)} >
                        {name}
                    </Link >
                ) : (
                    <strong>{name}</strong>
                )
            ),
        },
        {
            title: 'Contribution',
            dataIndex: 'contribution',
            render: (contribution: TableEntry['contribution']) => (
                <div>
                    {contribution.names.map((name, index) => (
                        <React.Fragment key={index}>
                            <span>{name}</span>
                            {index < contribution.names.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                    <br />
                    <span>{contribution.institution}</span>
                </div>
            ),
        },
        {
            title: 'Download',
            dataIndex: 'name',
            render: (name: string) => (
                <div>
                    <DownloadButton theme={theme} onClick={() => { downloadHref(`${basePath}/resources/images/1_experimental-data/neuronal-morphology/${name}.png`) }}>
                        ASC
                    </DownloadButton>
                </div>
            ),
        },
    ];

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <style jsx global>{`
                .preview-column {
                    width: 200px !important;
                    padding: .5rem !important;
                }
                .image-container {
                    width: 250px;
                    height: auto;
                    overflow: hidden;
                }
                .image-container img {
                    display: block;
                    width: 100%;
                    height: auto;
                }
            `}</style>
            <div className='pt-4' ref={tableRef}>
                <ResponsiveTable<TableEntry>
                    className="mt-3"
                    data={currentData}
                    columns={NeuronTableColumns}
                    tableLayout="fixed"
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
    );
};

export default NeuronTable;