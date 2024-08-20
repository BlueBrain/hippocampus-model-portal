import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FixedType } from 'rc-table/lib/interface';
import { basePath, imagesPath, dataPath } from "../../../config";

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

type TableEntry = {
    cell_id: string;
    contribution: {
        name: string;
        institution: string;
    };
};

const NeuronTableColumns = (instanceList, setLightboxOpen, setLightboxSlides, setLightboxIndex) => [
    {
        title: 'Cell ID',
        dataIndex: 'cell_id' as keyof TableEntry,
        fixed: 'left' as FixedType,
        render: () => <>{instanceList}</>,
    },
    {
        title: 'Slice Image',
        dataIndex: 'cell_id' as keyof TableEntry,
        render: (link: string, record: TableEntry, index: number) => {
            const imageUrl = `${imagesPath}1_experimental-data/layer-anatomy/${instanceList}.jpeg`;
            return (
                <Image
                    src={`${imagesPath}1_experimental-data/layer-anatomy/thumbnails/${instanceList}.jpeg`}
                    alt={`slice image ${instanceList}`}
                    width={150}
                    height={125}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setLightboxSlides([{ src: imageUrl }]);
                        setLightboxIndex(0);
                        setLightboxOpen(true);
                    }}
                />
            );
        },
    },
    {
        title: 'Contribution',
        dataIndex: 'contribution' as keyof TableEntry,
        fixed: 'left' as FixedType,
        render: (contribution: { name: string; institution: string }) => (
            <div>
                <span>{/*contribution.name */}</span><br />
                <span>{/*contribution.institution*/}</span>
            </div>
        ),
    },
    {
        title: 'Download',
        dataIndex: 'download' as keyof TableEntry,
        render: (value: number) => <NumberFormat value={value} />,
    },
];

type NeuronTableProps = {
    instanceList: string;
    theme?: number;
};

const Thickness: React.FC<NeuronTableProps> = ({ instanceList, theme }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSlides, setLightboxSlides] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    return (
        <>
            <h2>Instance: {instanceList}</h2>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                columns={NeuronTableColumns(instanceList, setLightboxOpen, setLightboxSlides, setLightboxIndex)}
            />

            <div className="mt-4">
                {/* 
                <DownloadButton onClick={() => downloadAsJson(data, `${instanceList}-data.json`)} theme={theme}>
                    Download <span className='collapsible-property small'>{instanceList}</span>
                </DownloadButton>
                */}
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