import React, { useEffect, useState } from 'react';
import { FixedType } from 'rc-table/lib/interface';
import ResponsiveTable from '@/components/ResponsiveTable';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { dataPath } from '@/config';
import NumberFormat from '@/components/NumberFormat';

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

const RateColumns = [
    {
        title: 'Neuron Type',
        dataIndex: 'neuronType',
        key: 'neuronType',
        fixed: 'left' as FixedType,
    },
    {
        title: 'Mean Rate (Hz)',
        dataIndex: 'meanRateHz',
        key: 'meanRateHz',
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'SE Rate (Hz)',
        dataIndex: 'seRateHz',
        key: 'seRateHz',
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'n',
        dataIndex: 'n',
        key: 'n',
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'SD Rate (Hz)',
        dataIndex: 'sdRateHz',
        key: 'sdRateHz',
        render: (value: number) => <NumberFormat value={value} />,
    },
    {
        title: 'Recording Condition',
        dataIndex: 'recordingCondition',
        key: 'recordingCondition',
    },
    {
        title: 'Source',
        dataIndex: 'source',
        key: 'source',
    }
];

type RateProps = {
    theme?: number;
};

const Rate: React.FC<RateProps> = ({ theme }) => {
    const [rateData, setRateData] = useState<TableEntry[]>([]);

    useEffect(() => {
        fetch(`${dataPath}/1_experimental-data/theta/rate.json`)
            .then(response => response.json())
            .then(data => setRateData(preprocessData(data)));
    }, []);

    return (
        <>
            <ResponsiveTable<TableEntry>
                className="mt-3"
                data={rateData}
                columns={RateColumns}
                rowKey={({ neuronType, recordingCondition, source }) => `${neuronType}_${recordingCondition}_${source}`}
            />
            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        rateData,
                        `theta-rate-data.json`
                    )}
                >
                    Rate Data
                </DownloadButton>
            </div>
        </>
    );
};

export default Rate;