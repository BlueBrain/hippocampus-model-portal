import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import HttpDownloadButton from '@/components/HttpDownloadButton';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import networkData from './network.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

type DataEntry = {
    Species: string;
    Age: string;
    Weight: string;
    "Dose (µM)": number | string;
    Drug: string;
    Application: string;
    Region: string;
    Layer: string;
    "Slice Thickness (µm)": number | string;
    "ACSF (mM)": {
        Ca: number | string;
        Mg: number | string;
        K: number | string;
    };
    Measurement: string;
    Effects: string;
    "n slices": number | string;
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
        Species: "Guinea pig",
        Age: "2-3 m",
        Weight: "-",
        "Dose (µM)": 50,
        Drug: "Carbachol",
        Application: "bath and focal",
        Region: "CA1 and CA3",
        Layer: "SP",
        "Slice Thickness (µm)": 500,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 1.6,
            K: 5
        },
        Measurement: "Intracellular recording of PC",
        Effects: "CCh-induced rhythmic bursts were recorded in both CA3 and CA1 PC of intact hippocampal slices. Where the CA3 and CA1 regions had been separated by a razor blade cut, rhythmic bursts were still observed in CA3 but not in CA1 neurons.",
        "n slices": 5,
        Reference: "Bianchi and Wong, 1994"
    },
    {
        Species: "Sprague-Dawley rat",
        Age: "11-28 d",
        Weight: "-",
        "Dose (µM)": 50,
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "SR",
        "Slice Thickness (µm)": 400,
        "ACSF (mM)": {
            Ca: 2.5,
            Mg: 1.3,
            K: 2.5
        },
        Measurement: "Extracellular recording in SR",
        Effects: "After a cut between CA3 and CA1, CCh induced robust oscillations in CA3, but not in CA1.",
        "n slices": 4,
        Reference: "Williams and Kauer, 1997"
    },
    {
        Species: "Wistar rat",
        Age: "15-25 d",
        Weight: "-",
        "Dose (µM)": 20,
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "SR",
        "Slice Thickness (µm)": 450,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 2,
            K: 3
        },
        Measurement: "Extracellular recording in SR",
        Effects: "CCh-induced 40-Hz oscillations are generated within the CA3 area and propagate to CA1 in intact slice. After the cut between CA3 and CA1, oscillations in CA3 persisted, whereas activity was observed in neither CA1 nor dentate gyrus.",
        "n slices": 4,
        Reference: "Fisahn et al., 1998"
    },
    {
        Species: "Sprague-Dawley rat",
        Age: "10-30 d",
        Weight: "-",
        "Dose (µM)": "4-13",
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "SP",
        "Slice Thickness (µm)": 400,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 2,
            K: 5
        },
        Measurement: "Extracellular recording in SP",
        Effects: "Low concentrations of CCh (4-13 µM) produced a regular pattern of synchronous discharges in the delta range (0.5-2 Hz). This rhythmic pattern originated in CA3, as assessed by isolating CA3 from CA1.",
        "n slices": 16,
        Reference: "Fellous and Sejnowski, 2000"
    },
    {
        Species: "Sprague-Dawley rat",
        Age: "10-30 d",
        Weight: "-",
        "Dose (µM)": "13-60",
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "SP",
        "Slice Thickness (µm)": 400,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 2,
            K: 5
        },
        Measurement: "Extracellular recording in SP",
        Effects: "Higher concentrations of CCh (13-60 µM) produced short episodes of synchronous population discharges at a regular frequency (5-10 Hz). Separating CA1 from CA3, oscillations were found in isolated CA3, but not in isolated CA1, and dual field recordings in CA3 and CA1 revealed a positive latency (~10-15 ms) in CA1.",
        "n slices": 3,
        Reference: "Fellous and Sejnowski, 2000"
    },
    {
        Species: "Sprague-Dawley rat",
        Age: "10-30 d",
        Weight: "-",
        "Dose (µM)": "8-25",
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "SP",
        "Slice Thickness (µm)": 400,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 2,
            K: 5
        },
        Measurement: "Extracellular recording in SP",
        Effects: "Concentrations of carbachol in the 8-25 µM range produced faster population discharges (40-50 Hz) in the gamma band in both CA1 and CA3. This oscillation was present in CA3 minislices, but was never observed in CA1 minislices.",
        "n slices": 6,
        Reference: "Fellous and Sejnowski, 2000"
    },
    {
        Species: "Sprague-Dawley rat",
        Age: "-",
        Weight: "200-300 g",
        "Dose (µM)": "1-100",
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1",
        Layer: "all",
        "Slice Thickness (µm)": 400,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 1,
            K: 3
        },
        Measurement: "Extracellular recordings",
        Effects: "The power spectra show a single distinguishable power peak in the gamma frequency band (45 Hz) in CA1 mini-slice. Maximal γ power was recorded at the SO-SP border.",
        "n slices": 78,
        Reference: "Pietersen et al., 2014"
    },
    {
        Species: "Sprague-Dawley rat",
        Age: "-",
        Weight: "200-300 g",
        "Dose (µM)": 10,
        Drug: "Carbachol",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "SP",
        "Slice Thickness (µm)": 400,
        "ACSF (mM)": {
            Ca: 2,
            Mg: 1,
            K: 3
        },
        Measurement: "Extracellular recording in SP",
        Effects: "In intact hippocampal slices CCh induced γ in both area CA3 and CA1.The γ in CA1a was phase-locked to the slow γ in CA3b. In these slices the power spectrum in CA1a had a single peak in the gamma frequency band with a dominant frequency of 33 Hz.",
        "n slices": 53,
        Reference: "Pietersen et al., 2014"
    },
    {
        Species: "Long–Evans rats",
        Age: "3-8 m",
        Weight: "350-500 g",
        "Dose (µM)": "-",
        Drug: "Tail pinches (correlated with ACh release)",
        Application: "bath",
        Region: "CA1",
        Layer: "all",
        "Slice Thickness (µm)": "-",
        "ACSF (mM)": {
            Ca: "-",
            Mg: "-",
            K: "-"
        },
        Measurement: "Extracellular recordings",
        Effects: "ACh release was highly correlated with the appearance of both spontaneous and induced theta oscillations (such release lagged behind theta initiation by 25-60 s)",
        "n slices": "-",
        Reference: "Zhang et al., 2010"
    },
    {
        Species: "ChAT-Cre transgenic mice",
        Age: "2-6 m",
        Weight: "-",
        "Dose (µM)": "-",
        Drug: "Optogenetic stimulation",
        Application: "bath",
        Region: "CA1 and CA3",
        Layer: "all",
        "Slice Thickness (µm)": "-",
        "ACSF (mM)": {
            Ca: "-",
            Mg: "-",
            K: "-"
        },
        Measurement: "Extracellular recordings",
        Effects: "Cholinergic stimulation completely blocked sharp wave ripples and strongly suppressed the power of both slow oscillations (0.5–2 Hz in anesthetized, 0.5–4 Hz in behaving animals) and supratheta (6–10 Hz in anesthetized, 10–25 Hz in behaving animals) bands. The same stimulation robustly increased both the power and coherence of theta oscillations (2–6 Hz) in urethane-anesthetized mice",
        "n slices": "-",
        Reference: "Vandecasteele et al. 2014"
    }
];

const columns = [
    {
        title: 'Species',
        dataIndex: 'Species' as keyof DataEntry,
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
        title: 'Dose (µM)',
        dataIndex: 'Dose (µM)' as keyof DataEntry,
    },
    {
        title: 'Drug',
        dataIndex: 'Drug' as keyof DataEntry,
    },
    {
        title: 'Application',
        dataIndex: 'Application' as keyof DataEntry,
    },
    {
        title: 'Region',
        dataIndex: 'Region' as keyof DataEntry,
    },
    {
        title: 'Layer',
        dataIndex: 'Layer' as keyof DataEntry,
    },
    {
        title: 'Slice Thickness (µm)',
        dataIndex: 'Slice Thickness (µm)' as keyof DataEntry,
    },
    {
        title: 'ACSF (mM)',
        children: [
            {
                title: 'Ca',
                dataIndex: ['ACSF (mM)', 'Ca'],
                render: (Ca: number | null) => <>{Ca !== null ? Ca : '-'}</>,
            },
            {
                title: 'Mg',
                dataIndex: ['ACSF (mM)', 'Mg'],
                render: (Mg: number | null) => <>{Mg !== null ? Mg : '-'}</>,
            },
            {
                title: 'K',
                dataIndex: ['ACSF (mM)', 'K'],
                render: (K: number | null) => <>{K !== null ? K : '-'}</>,
            },
        ],
    },

    {
        title: 'Measurement',
        dataIndex: 'Measurement' as keyof DataEntry,
    },
    {
        title: 'Effects',
        dataIndex: 'Effects' as keyof DataEntry,
    },
    {
        title: 'N Slices',
        dataIndex: 'n slices' as keyof DataEntry,
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

type NetwrokProps = {
    theme?: number;
};


const Netwrok: React.FC<NetwrokProps> = ({ theme }) => {
    return (
        <>
            <ResponsiveTable<DataEntry>
                className="mb-2"
                columns={columns}
                data={data}
                rowKey={(record) => record.Reference}
            />

            <div className="text-right mt-4">
                <DownloadButton
                    theme={theme}
                    onClick={() => downloadAsJson(
                        networkData,
                        `Network-Data.json`
                    )}
                >
                    Network Data
                </DownloadButton>
            </div>

        </>
    );
};


export default Netwrok;
