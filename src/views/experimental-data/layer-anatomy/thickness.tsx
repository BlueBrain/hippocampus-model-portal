import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FixedType } from 'rc-table/lib/interface';
import { hippocampus, basePath, nexusImgLoaderUrl } from "../../../config";

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

// Dynamically import Lightbox
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import SLMData from './slm.json';
import SRData from './sr.json';
import SPData from './sp.json';
import SOData from './so.json';

type Layer = 'SLM' | 'SR' | 'SP' | 'SO';

type TableEntry = {
    cell_id: string;
    layer: string;
    layer_thickness: number;
    no_mesurement: number;
    m_type: string;
    contribution: {
        name: string;
        institution: string;
    };
};

const ThicknessColumns = (data, setLightboxOpen, setLightboxSlides, setLightboxIndex) => [
    {
        title: 'Cell ID',
        dataIndex: 'cell_id' as keyof TableEntry,
        fixed: 'left' as FixedType,
        render: (text: string, record: TableEntry) => (
            <a href={`${basePath}experimental-data/neuronal-morphology/?layer=${record.layer}&mtype=${record.m_type}&instance=${record.cell_id}`} rel="noopener noreferrer">
                {record.cell_id}
            </a>
        ),
    },
    {
        title: 'Slice Image',
        dataIndex: 'cell_id' as keyof TableEntry,
        render: (link: string, record: TableEntry, index: number) => {
            const imageUrl = `${nexusImgLoaderUrl}exp-morph-images/${link}.jpeg`;
            return (
                <Image
                    src={`${nexusImgLoaderUrl}exp-morph-images/thumbnails/${link}.jpeg`}
                    alt={`slice image ${link}`}
                    width={150}
                    height={125}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setLightboxSlides(data.map(entry => ({ src: `${nexusImgLoaderUrl}/exp-morph-images/${entry.cell_id}.jpeg` })));
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                    }}
                />
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
        render: (contribution: { name: string; institution: string }) => (
            <div>
                <span>{contribution.name}</span><br />
                <span>{contribution.institution}</span>
            </div>
        ),
    },
];

type ThicknessProps = {
    layer: Layer;
};

const Thickness: React.FC<ThicknessProps> = ({ layer }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSlides, setLightboxSlides] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

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
                columns={ThicknessColumns(data, setLightboxOpen, setLightboxSlides, setLightboxIndex)}
            />
            <div className="text-right mt-2">
                <HttpDownloadButton onClick={() => downloadAsJson(data, `exp-${layer}-table.json`)}>
                    Download table data
                </HttpDownloadButton>
            </div>
            {lightboxOpen && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={lightboxSlides}
                    index={lightboxIndex}
                />
            )}
        </>
    );
};

export default Thickness;