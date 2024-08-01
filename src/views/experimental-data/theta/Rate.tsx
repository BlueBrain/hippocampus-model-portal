import React from 'react';
import { FixedType } from 'rc-table/lib/interface';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { downloadAsJson } from '@/utils';

import rawRateData from './rate.json'; // Ensure this path matches the location of your JSON file
import DownloadButton from '@/components/DownloadButton/DownloadButton';

type TableEntry = {
    neuronType: string;
    meanRateHz: number;
    seRateHz: number;
    n: number;
    sdRateHz: number;
    recordingCondition: string;
    source: string;
};

const preprocessData = (data: any[]): TableEntry[] => {
    if (!Array.isArray(data)) {
        console.error("Data is not an array", data);
        return [];
    }

    return data.map((item) => ({
        neuronType: item['neuron_type'],
        meanRateHz: item['mean_rate_Hz'],
        seRateHz: item['SE_rate_Hz'],
        n: item['n'],
        sdRateHz: item['SD_rate_Hz'],
        recordingCondition: item['recording_condition'],
        source: item['source']
    }));
};

const PhaseData: TableEntry[] = preprocessData(rawRateData);

const PhaseColumns = [
    {
        title: 'Neuron Type',
        dataIndex: 'neuronType' as keyof TableEntry,
        key: 'neuronType',
        fixed: 'left' as FixedType,
    },
    {
        title: 'Mean Rate (Hz)',
        dataIndex: 'meanRateHz' as keyof TableEntry,
        key: 'meanRateHz',
        render: (meanRateHz: number) => <NumberFormat value={meanRateHz} />,
    },
    {
        title: 'SE Rate (Hz)',
        dataIndex: 'seRateHz' as keyof TableEntry,
        key: 'seRateHz',
        render: (seRateHz: number) => <NumberFormat value={seRateHz} />,
    },
    {
        title: 'n',
        dataIndex: 'n' as keyof TableEntry,
        key: 'n',
        render: (n: number) => <NumberFormat value={n} />,
    },
    {
        title: 'SD Rate (Hz)',
        dataIndex: 'sdRateHz' as keyof TableEntry,
        key: 'sdRateHz',
        render: (sdRateHz: number) => <NumberFormat value={sdRateHz} />,
    },
    {
        title: 'Recording Condition',
        dataIndex: 'recordingCondition' as keyof TableEntry,
        key: 'recordingCondition',
    },
    {
        title: 'Source',
        dataIndex: 'source' as keyof TableEntry,
        key: 'source',
    }
];

type RateProps = {
    theme?: number;
};

const Rate: React.FC<RateProps> = ({ theme }) => {
    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={PhaseData}
                columns={PhaseColumns}
                rowKey={({ neuronType, recordingCondition, source }) => `${neuronType}_${recordingCondition}_${source}`}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        PhaseData,
                        `theta-rate-table.json`
                    )}
                >
                    table data
                </DownloadButton>
            </div>
        </>
    );
};

export default Rate;
