import React, { useState, useEffect } from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type TableEntry = {
    Pathway: string;
    Convergence: number;
};

const AnatomyColumns = [
    {
        title: 'Pathway',
        dataIndex: 'Pathway' as keyof TableEntry,
    },
    {
        title: 'Convergence',
        dataIndex: 'Convergence' as keyof TableEntry,
        render: (value: number) => value.toFixed(3),
    },
];

type AnatomyProps = {
    theme?: number;
};

const Anatomy: React.FC<AnatomyProps> = ({ theme }) => {
    const [data, setData] = useState<TableEntry[] | null>(null);

    useEffect(() => {
        fetch(dataPath + '/2_reconstruction-data/schaffer-collaterals/anatomy.json')
            .then((response) => response.json())
            .then((fetchedData) => setData(fetchedData));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={data}
                columns={AnatomyColumns}
                rowKey={(record) => record.Pathway}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        data,
                        `Anatomy-Data.json`
                    )}
                >
                    Anatomy Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Anatomy;