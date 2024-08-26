import React, { useEffect, useState } from 'react';
import { FixedType } from 'rc-table/lib/interface';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

type TableEntry = {
    morphologicalType: string;
    meanAngle: number;
    angularDeviation: number | null;
    meanFiringRate: number | null;
    minFiringRate: number | null;
    maxFiringRate: number | null;
    n: number;
    specie: string;
    reference: string;
};

const preprocessData = (data: any[]): TableEntry[] => {
    return data.map((item) => ({
        morphologicalType: item['Morphological type'],
        meanAngle: item['Mean angle (deg)'],
        angularDeviation: item['Angular deviation (deg)'],
        meanFiringRate: item['Mean firing rate (Hz)'],
        minFiringRate: item['Min firing rate (Hz)'],
        maxFiringRate: item['Max firing rate (Hz)'],
        n: item['n'],
        specie: item['Specie'],
        reference: item['Reference']
    }));
};

const PhaseColumns = [
    {
        title: 'Morphological Type',
        dataIndex: 'morphologicalType',
        key: 'morphologicalType',
        fixed: 'left' as FixedType,
    },
    {
        title: 'Mean Angle (deg)',
        dataIndex: 'meanAngle',
        key: 'meanAngle',
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'Angular Deviation (deg)',
        dataIndex: 'angularDeviation',
        key: 'angularDeviation',
        render: (value: number | null) => <NumberFormat value={value} />,
    },
    {
        title: 'Mean Firing Rate (Hz)',
        dataIndex: 'meanFiringRate',
        key: 'meanFiringRate',
        render: (value: number | null) => <NumberFormat value={value} />,
    },
    {
        title: 'Min Firing Rate (Hz)',
        dataIndex: 'minFiringRate',
        key: 'minFiringRate',
        render: (value: number | null) => <NumberFormat value={value} />,
    },
    {
        title: 'Max Firing Rate (Hz)',
        dataIndex: 'maxFiringRate',
        key: 'maxFiringRate',
        render: (value: number | null) => <NumberFormat value={value} />,
    },
    {
        title: 'n',
        dataIndex: 'n',
        key: 'n',
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'Specie',
        dataIndex: 'specie',
        key: 'specie',
    },
    {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'reference',
    }
];

type PhaseProps = {
    theme?: number;
};

const Phase: React.FC<PhaseProps> = ({ theme }) => {
    const [phaseData, setPhaseData] = useState<TableEntry[]>([]);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/theta/phase.json`)
            .then(response => response.json())
            .then(data => setPhaseData(preprocessData(data)));
    }, []);

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={phaseData}
                columns={PhaseColumns}
                rowKey={({ morphologicalType, specie, reference }) => `${morphologicalType}_${specie}_${reference}`}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        phaseData,
                        `theta-phase-data.json`
                    )}
                >
                    Phase Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Phase;