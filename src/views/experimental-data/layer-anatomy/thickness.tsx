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
    cell_Id: string;
    imageLink: string;
    layerThickness: number;
    noMeasurements: number;
    contribution: string;
};

const ThicknessColumns = [
    {
        title: 'Cell ID',
        dataIndex: 'cell_id' as keyof TableEntry,
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

type Layer = 'SLM' | 'SR' | 'SP' | 'SO';

type ThicknessProps = {
    layer: Layer;
};

const Thickness: React.FC<ThicknessProps> = ({ layer }) => {
    let data: TableEntry[];

    switch (layer) {
        case 'SML':
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