import React from 'react';
import Image from 'next/image';
import { FixedType } from 'rc-table/lib/interface';
import { hippocampus, basePath, nexusImgLoaderUrl } from "../../../config";

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import SLMData from './slm.json';
import SRData from './sr.json';
import SPData from './sp.json';
import SOData from './so.json';

type Layer = 'SLM' | 'SR' | 'SP' | 'SO';

type TableEntry = {
    cell_Id: string;
    layerThickness: number;
    noMeasurements: number;
    contribution: string;
};

const ThicknessColumns = (layer) => [
    {
        title: 'Cell ID',
        dataIndex: 'cell_id' as keyof TableEntry,
        fixed: 'left' as FixedType,
        render: (link: string) => <a href={`${basePath}/experimental-data/neuronal-morphology/?layer=${layer}&mtype=SLM_PPA&instance=${link}`} target="_blank" rel="noopener noreferrer">{link}</a>,
    },
    {
        title: 'Slice Image',
        dataIndex: 'cell_id' as keyof TableEntry,
        render: (link: string) => {
            return (
                <Image src={`${nexusImgLoaderUrl}/exp-morph-images/${link}.jpeg`} alt={`slice image ${link}`} width={400} height={300} />
            );
        },
    },
    {
        title: 'Layer Thickness',
        dataIndex: 'layer_thickness' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'No. of Measurements',
        dataIndex: 'no_mesurement' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />,

    },
    {
        title: 'Contribution',
        dataIndex: 'contribution' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
];

type ThicknessProps = {
    layer: Layer;
};

const Thickness: React.FC<ThicknessProps> = ({ layer }) => {
    let data: TableEntry[];

    switch (layer) {
        case 'SLM':
            data = SLMData;
            break;
        case 'SR':
            data = SRData;
            break;
        case 'SP':
            data = SPData;
            break;
        case 'SO':
            data = SOData;
            break;
        default:
            data = [];
            break;
    }

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={data}
                columns={ThicknessColumns(layer)}
            />
            <div className="text-right mt-2">
                <HttpDownloadButton onClick={() => downloadAsJson(data, `exp-${layer}-table.json`)}>
                    Download table data
                </HttpDownloadButton>
            </div>
        </>
    );
};

export default Thickness;