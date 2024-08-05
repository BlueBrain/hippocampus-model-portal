import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import rawPhaseData from './phase.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

type TableEntry = {
    morphologicalType: string;
    meanAngle: number;
    angularDeviation: number;
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

const PhaseData: TableEntry[] = preprocessData(rawPhaseData);

const PhaseColumns = [
    {
        title: 'Morphological Type',
        dataIndex: 'morphologicalType' as keyof TableEntry,
        key: 'morphologicalType',
        fixed: 'left' as FixedType,
    },
    {
        title: 'Mean Angle (deg)',
        dataIndex: 'meanAngle' as keyof TableEntry,
        key: 'meanAngle',
        render: (meanAngle: number) => <NumberFormat value={meanAngle} />,
    },
    {
        title: 'Angular Deviation (deg)',
        dataIndex: 'angularDeviation' as keyof TableEntry,
        key: 'angularDeviation',
        render: (angularDeviation: number) => <NumberFormat value={angularDeviation} />,
    },
    {
        title: 'Mean Firing Rate (Hz)',
        dataIndex: 'meanFiringRate' as keyof TableEntry,
        key: 'meanFiringRate',
        render: (meanFiringRate: number | null) => <NumberFormat value={meanFiringRate} />,
    },
    {
        title: 'Min Firing Rate (Hz)',
        dataIndex: 'minFiringRate' as keyof TableEntry,
        key: 'minFiringRate',
        render: (minFiringRate: number | null) => <NumberFormat value={minFiringRate} />,
    },
    {
        title: 'Max Firing Rate (Hz)',
        dataIndex: 'maxFiringRate' as keyof TableEntry,
        key: 'maxFiringRate',
        render: (maxFiringRate: number | null) => <NumberFormat value={maxFiringRate} />,
    },
    {
        title: 'n',
        dataIndex: 'n' as keyof TableEntry,
        key: 'n',
        render: (n: number) => <NumberFormat value={n} />,
    },
    {
        title: 'Specie',
        dataIndex: 'specie' as keyof TableEntry,
        key: 'specie',
    },
    {
        title: 'Reference',
        dataIndex: 'reference' as keyof TableEntry,
        key: 'reference',
    }
];

type PhaseProps = {
    theme?: number;
};

const Phase: React.FC<PhaseProps> = ({ theme }) => {
    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={PhaseData}
                columns={PhaseColumns}
                rowKey={({ morphologicalType, specie, reference }) => `${morphologicalType}_${specie}_${reference}`}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        PhaseData,
                        `theta-phase-data.json`
                    )}
                >
                    Download Phase Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Phase;
