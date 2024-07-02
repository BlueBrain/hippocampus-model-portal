import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import connectionProbabilityData from './connection-probability.json';

type DataEntry = {
    Pre: string;
    Post: string;
    Specie: string;
    Age: string;
    Weight: string;
    SliceThickness: string;
    Distance: string;
    n: number;
    N: number;
    p: number;
    Reference: string;
};

const termDescription = {
    ...mtypeDescription,
    ...layerDescription,
};

const Term = termFactory(termDescription);

function getMtypeDescription(fullMtype: string) {
    const [layer, mtype] = fullMtype.split('_');

    return layerDescription[layer] && mtypeDescription[mtype]
        ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
        : null;
}


const data: DataEntry[] = [
    {
        Pre: "PC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "100-180 g",
        SliceThickness: "400-500",
        Distance: "-",
        n: 11,
        N: 989,
        p: 0.011,
        Reference: "Deuchars and Thomson, 1996"
    },
    {
        Pre: "PC",
        Post: "OLM",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "90-150 g",
        SliceThickness: "450-500",
        Distance: "-",
        n: 12,
        N: 36,
        p: 0.333,
        Reference: "Ali and Thomson, 1998"
    },
    {
        Pre: "PVBC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 49,
        N: 167,
        p: 0.293,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "PC",
        Post: "PVBC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 16,
        N: 124,
        p: 0.129,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "BS",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 2,
        N: 6,
        p: 0.333,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "PC",
        Post: "BS",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 2,
        N: 4,
        p: 0.5,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "CCKBC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 21,
        N: 88,
        p: 0.239,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "PC",
        Post: "CCKBC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 8,
        N: 81,
        p: 0.099,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "CCKBS",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 5,
        N: 36,
        p: 0.139,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "PC",
        Post: "CCKBS",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 6,
        N: 35,
        p: 0.171,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "PC",
        Post: "SCA",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 0,
        N: 32,
        p: 0,
        Reference: "Pawelzik et al., 2002"
    },
    {
        Pre: "Ivy",
        Post: "PC",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "140-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 3,
        N: 5,
        p: 0.6,
        Reference: "Fuentealba et al., 2008"
    },
    {
        Pre: "Ivy",
        Post: "Ivy",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "140-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 1,
        N: 4,
        p: 0.25,
        Reference: "Fuentealba et al., 2008"
    },
    {
        Pre: "INT",
        Post: "PC",
        Specie: "Wistar rat",
        Age: "-",
        Weight: "140-200 g",
        SliceThickness: "450",
        Distance: "-",
        n: 6,
        N: 21,
        p: 0.286,
        Reference: "Fuentealba et al., 2008"
    },
    {
        Pre: "BC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "450-500",
        Distance: "-",
        n: 57,
        N: 263,
        p: 0.217,
        Reference: "Ali et al., 1999"
    },
    {
        Pre: "BC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "-",
        Distance: "50-100",
        n: 46,
        N: 89,
        p: 0.517,
        Reference: "Ali et al., 1999"
    },
    {
        Pre: "BC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "120-200 g",
        SliceThickness: "-",
        Distance: "> 150-200",
        n: 6,
        N: 120,
        p: 0.05,
        Reference: "Ali et al., 1999"
    },
    {
        Pre: "PC",
        Post: "BS",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "90-180 g",
        SliceThickness: "450-500",
        Distance: "-",
        n: 8,
        N: 53,
        p: 0.151,
        Reference: "Ali et al., 1998"
    },
    {
        Pre: "PC",
        Post: "BC",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "90-180 g",
        SliceThickness: "450-500",
        Distance: "-",
        n: 9,
        N: 195,
        p: 0.046,
        Reference: "Ali et al., 1998"
    },
    {
        Pre: "PC",
        Post: "SP_INT",
        Specie: "Sprague-Dawley rat",
        Age: "-",
        Weight: "90-180 g",
        SliceThickness: "450-500",
        Distance: "-",
        n: 23,
        N: 371,
        p: 0.062,
        Reference: "Ali et al., 1998"
    },
    {
        Pre: "SCA",
        Post: "SCA",
        Specie: "Wistar rat",
        Age: "18-23 d",
        Weight: "-",
        SliceThickness: "300-330",
        Distance: "-",
        n: 20,
        N: 240,
        p: 0.083,
        Reference: "Ali, 2007"
    },
    {
        Pre: "CCKBC",
        Post: "PC",
        Specie: "Sprague-Dawley rat",
        Age: "16-20 d",
        Weight: "-",
        SliceThickness: "350",
        Distance: "-",
        n: 0,
        N: 0,
        p: 0.1,
        Reference: "Neu et al., 2007"
    },
    {
        Pre: "SO",
        Post: "SLM",
        Specie: "Sprague-Dawley rat",
        Age: "18-22 d",
        Weight: "-",
        SliceThickness: "300-350",
        Distance: "-",
        n: 1,
        N: 20,
        p: 0.05,
        Reference: "Elfant et al., 2008"
    }
];

const columns = [
    {
        title: 'Pre',
        dataIndex: 'Pre' as keyof DataEntry,
        render: pre => (<Term term={pre} description={getMtypeDescription(pre)} />),
    },
    {
        title: 'Post',
        dataIndex: 'Post' as keyof DataEntry,
        render: post => (<Term term={post} description={getMtypeDescription(post)} />),
    },
    {
        title: 'Specie',
        dataIndex: 'Specie' as keyof DataEntry,
    },
    {
        title: 'Age',
        dataIndex: 'Age' as keyof DataEntry,
    },
    {
        title: 'Weight',
        dataIndex: 'Weight' as keyof DataEntry,
    },
    {
        title: 'Slice thickness',
        dataIndex: 'SliceThickness' as keyof DataEntry,
    },
    {
        title: 'Distance',
        dataIndex: 'Distance' as keyof DataEntry,
    },
    {
        title: 'n',
        dataIndex: 'n' as keyof DataEntry,
    },
    {
        title: 'N',
        dataIndex: 'N' as keyof DataEntry,
    },
    {
        title: 'p',
        dataIndex: 'p' as keyof DataEntry,
        render: p => (<NumberFormat value={p} />),
    },
    {
        title: 'Reference',
        dataIndex: 'Reference' as keyof DataEntry,
        render: reference => (
            <a href="#" target="_blank" rel="noopener noreferrer">
                {reference}
            </a>
        ),
    }
];


const ConnectionProbabilityTable = () => {
    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
            //rowKey={({ from, to }) => `${from}_${to}`}
            />

            <div className="text-right mt-2">
                <HttpDownloadButton
                    onClick={() => downloadAsJson(
                        connectionProbabilityData,
                        `exp-connection-anatomy_-_connection-probability-table.json`
                    )}
                >
                    table data
                </HttpDownloadButton>
            </div>

        </>
    );
};


export default ConnectionProbabilityTable;
