import React, { useMemo } from 'react';
import { Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { basePath } from '@/config';
import MorphologyData from '@/models.json';

type MorphologyTableProps = {
    currentInstance: string;
};

const ExperimentalMorphologyTable: React.FC<MorphologyTableProps> = ({ currentInstance }) => {
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
            dataIndex: 'morphology',
            key: 'morphology',
            width: 150,
            render: (morphology: string) => (
                <Link href={`/morphology-details/${morphology}`}>
                    {morphology}
                </Link>
            ),
        },
        {
            title: 'Preview',
            dataIndex: 'morphology',
            key: 'preview',
            width: 220,
            render: (morphology: string) => (
                <Image
                    src={`${basePath}/data/images/1_experimental-data/neuronal-morphology/${morphology}.png`}
                    alt={`morphology preview ${morphology}`}
                    width={200}
                    height={100}
                    style={{ height: 'auto' }}
                />
            ),
        },
    ];

    const tableData = useMemo(() => {
        if (!Array.isArray(MorphologyData)) {
            console.error('MorphologyData is not an array:', MorphologyData);
            return [];
        }
        const currentModel = MorphologyData.find(item => item.name === currentInstance);
        if (!currentModel) {
            console.error('No matching model found for:', currentInstance);
            console.log('Available models:', MorphologyData.map(item => item.name));
            return [];
        }
        return [{
            key: currentModel.name,
            layer: currentModel.layer,
            mtype: currentModel.mtype,
            morphology: currentModel.morphology,
        }];
    }, [currentInstance]);

    console.log('Current instance:', currentInstance);
    console.log('Table data:', tableData);

    return (
        <>
            <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
            {tableData.length === 0 && (
                <p>No data found for the current instance: {currentInstance}</p>
            )}
        </>
    );
};

export default ExperimentalMorphologyTable;
