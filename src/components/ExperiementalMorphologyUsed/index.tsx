import React, { useMemo } from 'react';
import { Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { basePath } from '@/config';


type MorphologyTableProps = {
    currentInstance: string;
    MorphologyData: any;
    isMorphologyLibrary?: boolean;
};

const ExperimentalMorphologyTable: React.FC<MorphologyTableProps> = ({ currentInstance, MorphologyData, isMorphologyLibrary }) => {
    const columns = useMemo(() => {
        const baseColumns = [
            {
                title: 'Morphology',
                dataIndex: 'morphology',
                key: 'morphology',
                width: 150,
                render: (morphology: string, record: any) => (
                    isMorphologyLibrary ? (
                        <Link href={`/reconstruction-data/morphology-library/?layer=${record.layer}&etype=${record.etype}&mtype=${record.mtype}&morphology=${morphology}`}>
                            {morphology}
                        </Link>
                    ) : (
                        <Link href={`/experimental-data/neuronal-morphology/?layer=${record.layer}&mtype=${record.mtype}&instance=${record.morphology}`}>
                            {morphology}
                        </Link>
                    )
                ),
            },
            {
                title: 'M-type',
                dataIndex: 'mtype',
                key: 'mtype',
                width: 150,
            },

        ];

        if (!isMorphologyLibrary) {
            baseColumns.push({
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
            });
        }

        return baseColumns;
    }, [isMorphologyLibrary]);

    const tableData = useMemo(() => {
        if (!Array.isArray(MorphologyData)) {
            console.error('MorphologyData is not an array:', MorphologyData);
            return [];
        }

        let currentModel;
        if (isMorphologyLibrary) {
            currentModel = MorphologyData.find(item => item.morphology === currentInstance || item.id === currentInstance);
        } else {
            currentModel = MorphologyData.find(item => item.name === currentInstance);
        }

        if (!currentModel) {
            console.error('No matching model found for:', currentInstance);
            console.log('Available models:', MorphologyData.map(item => isMorphologyLibrary ? item.morphology : item.name));
            return [];
        }

        return [{
            key: currentModel.name || currentModel.morphology,
            layer: currentModel.layer,
            mtype: currentModel.mtype,
            morphology: currentModel.morphology,
        }];
    }, [currentInstance, isMorphologyLibrary, MorphologyData]);

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
