import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import SLMData from './slm.json';
import SRData from './sr.json';
import SPData from './sp.json';
import SOData from './so.json';

type TableEntry = {
    cellId: string;
    imageLink: string;
    layerThickness: number;
    noMeasurements: number;
    contribution: string;
};

const ThicknessColumns = [
    {
        title: 'Cell ID',
        dataIndex: 'cellId' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
    {
        title: 'Image Link',
        dataIndex: 'imageLink' as keyof TableEntry,
        fixed: 'left' as FixedType,
        render: (link: string) => <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>,
    },
    {
        title: 'Layer Thickness',
        dataIndex: 'layerThickness' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'No. of Measurements',
        dataIndex: 'noMeasurements' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />
    },
    {
        title: 'Contribution',
        dataIndex: 'contribution' as keyof TableEntry,
        fixed: 'left' as FixedType,
    },
];

type ThicknessProps = {
    layer: 'slm' | 'sr' | 'sp' | 'so';
};

const Thickness: React.FC<ThicknessProps> = ({ layer }) => {
    let data: TableEntry[] = [];

    switch (layer) {
        case 'slm':
            data = SLMData.map(item => ({
                cellId: item.cell_id,
                imageLink: item.image_link,
                layerThickness: item.layer_thickness,
                noMeasurements: item.no_mesurement,
                contribution: item.contribution,
            }));
            break;
        case 'sr':
            data = SRData.map(item => ({
                cellId: item.cell_id,
                imageLink: item.image_link,
                layerThickness: item.layer_thickness,
                noMeasurements: item.no_mesurement,
                contribution: item.contribution,
            }));
            break;
        case 'sp':
            data = SPData.map(item => ({
                cellId: item.cell_id,
                imageLink: item.image_link,
                layerThickness: item.layer_thickness,
                noMeasurements: item.no_mesurement,
                contribution: item.contribution,
            }));
            break;
        case 'so':
            data = SOData.map(item => ({
                cellId: item.cell_id,
                imageLink: item.image_link,
                layerThickness: item.layer_thickness,
                noMeasurements: item.no_mesurement,
                contribution: item.contribution,
            }));
            break;
        default:
            break;
    }

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={data}
                columns={ThicknessColumns}
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