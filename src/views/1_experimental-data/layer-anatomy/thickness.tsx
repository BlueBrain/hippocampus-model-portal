import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FixedType } from 'rc-table/lib/interface';
import { basePath, imagesPath, dataPath } from "../../../config";

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';

import { Layer } from '../../../types'

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";


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
            <a href={`${basePath}/experimental-data/neuronal-morphology/?layer=${record.layer}&mtype=${record.m_type}&instance=${record.cell_id}`} rel="noopener noreferrer">
                {record.cell_id}
            </a>
        ),
    },
    {
        title: 'Slice Image',
        dataIndex: 'cell_id' as keyof TableEntry,
        render: (link: string, record: TableEntry, index: number) => {
            return (
                <Image
                    src={`${basePath}/data/images/1_experimental-data/slices/thumbnails/${link}.jpeg`}
                    alt={`slice image ${link}`}
                    width={150}
                    height={125}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setLightboxSlides(data.map(entry => ({ src: `${basePath}/data/images/1_experimental-data/slices/${entry.cell_id}.jpeg` })));
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
    theme?: number;
};

const Thickness: React.FC<ThicknessProps> = ({ layer, theme }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSlides, setLightboxSlides] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [data, setData] = useState<TableEntry[]>([]);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/layer-anatomy/${layer.toLowerCase()}.json`)
            .then(response => response.json())
            .then(fetchedData => setData(fetchedData));
    }, [layer]);

    if (!data.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={data}
                columns={ThicknessColumns(data, setLightboxOpen, setLightboxSlides, setLightboxIndex)}
            />

            <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(data, `${layer}-data.json`)} theme={theme}>
                    Download <span className='collapsible-property small'>{layer}</span>
                </DownloadButton>
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