import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';
import ScatterPlotSelector from '@/components/ScatterPlotSelector';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import TimeSpikePlot from './components/TimeSpikePlot';
import MeanFiringRatePlot from './components/MeanFiringRatePlot';
import { QuickSelectorEntry, VolumeSection } from '@/types';
import models from "./models.json";
import { dataPath } from '@/config';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import { volumeSections } from '@/constants';
import TraceGraph from './components/Trace';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import DistributionPlot from '@/components/DistributionPlot';

const voltageSectionStructure = {
    cylinder: {
        K_Inj: [110, 115, 120, 122, 124, 126, 128, 130, 140],
        CA_O: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]
    },
    region: {
        K_Inj: [115, 120, 122, 124, 126, 128, 130, 140],
        CA_O: [1, 1.5, 2]
    },
    slice: {
        K_Inj: [120, 130, 140],
        CA_O: [1, 2]
    }
};

const VoltageView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);

    const getVolumeSection = (): VolumeSection => (quickSelection.volume_section as VolumeSection) || 'region';
    const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
    const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();

    useEffect(() => {
        if (!router.isReady) return;
        const { volume_section, mtype, etype, ca_o, k_inj } = router.query;
        const newQuickSelection: Record<string, string | number> = {};
        if (typeof volume_section === 'string') newQuickSelection.volume_section = volume_section;
        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof ca_o === 'string') newQuickSelection.ca_o = parseFloat(ca_o);
        if (typeof k_inj === 'string') newQuickSelection.k_inj = parseFloat(k_inj);
        if (typeof mtype === 'string') {
            const availableEtypes = getEtypes(mtype);
            newQuickSelection.etype = typeof etype === 'string' && availableEtypes.includes(etype) ? etype : availableEtypes[0] || '';
        }
        setQuickSelection(newQuickSelection);
        if (Object.keys(newQuickSelection).length === 0) {
            const defaultMtype = getMtypes()[0];
            const defaultSection = 'region';
            const defaultSelection = {
                volume_section: defaultSection,
                mtype: defaultMtype,
                etype: getEtypes(defaultMtype)[0] || '',
                ca_o: voltageSectionStructure[defaultSection].CA_O[0],
                k_inj: voltageSectionStructure[defaultSection].K_Inj[0]
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { volume_section, ca_o, k_inj, mtype, etype } = quickSelection;
            if (ca_o === undefined || k_inj === undefined || !mtype || !etype || !volume_section) return;
            const baseUrl = `${dataPath}/5_prediction/voltage/${volume_section}/${ca_o}-${k_inj}/${mtype}-${etype}`;
            const dataTypes = [
                { name: 'spike-time', setter: setSpikeTimeData },
                { name: 'mean-firing-rate', setter: setMeanFiringRateData },
                { name: 'trace', setter: setTraceData }
            ];
            for (const { name, setter } of dataTypes) {
                try {
                    const response = await fetch(`${baseUrl}/${name}.json`);
                    const data = await response.json();
                    setter(data);
                } catch (error) {
                    console.error(`Error fetching ${name} data:`, error);
                    setter(null);
                }
            }
        };
        fetchData();
    }, [quickSelection]);

    const setParams = (params: Record<string, string | number>): void => {
        const newQuery = { ...router.query, ...params };
        router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
    };

    const handleVolumeSelect = (volume_section: VolumeSection) => {
        const currentMtype = quickSelection.mtype as string;
        const currentEtype = quickSelection.etype as string;

        const availableMtypes = getMtypes();
        const newMtype = availableMtypes.includes(currentMtype) ? currentMtype : availableMtypes[0];

        const availableEtypes = getEtypes(newMtype);
        const newEtype = availableEtypes.includes(currentEtype) ? currentEtype : availableEtypes[0];

        const newSelection = {
            ...quickSelection,
            volume_section,
            ca_o: voltageSectionStructure[volume_section].CA_O[0],
            k_inj: voltageSectionStructure[volume_section].K_Inj[0],
            mtype: newMtype,
            etype: newEtype
        };
        setQuickSelection(newSelection);
        setParams(newSelection);
    };



    const handleMtypeSelect = (mtype: string) => {
        const availableEtypes = getEtypes(mtype);
        const newEtype = availableEtypes[0] || '';
        setQuickSelection(prev => ({ ...prev, mtype, etype: newEtype }));
        setParams({ mtype, etype: newEtype });
    };

    const handleEtypeSelect = (etype: string) => {
        setQuickSelection(prev => ({ ...prev, etype }));
        setParams({ etype });
    };

    const handleScatterPlotSelect = (ca_o: number, k_inj: number) => {
        setQuickSelection(prev => ({ ...prev, ca_o, k_inj }));
        setParams({ ca_o, k_inj });
    };

    const mtypes = getMtypes();
    const etypes = getEtypes(quickSelection.mtype as string);

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'Volume Section',
            key: 'volume_section',
            values: volumeSections,
            setFn: handleVolumeSelect,
        },
        {
            title: 'CA_0',
            key: 'ca_o',
            getValuesFn: () => voltageSectionStructure[getVolumeSection()].CA_O,
            sliderRange: voltageSectionStructure[getVolumeSection()].CA_O
        },
        {
            title: 'K_Inj',
            key: 'k_inj',
            getValuesFn: () => voltageSectionStructure[getVolumeSection()].K_Inj,
            sliderRange: voltageSectionStructure[getVolumeSection()].K_Inj
        },
        {
            title: 'M-type',
            key: 'mtype',
            values: mtypes,
            setFn: handleMtypeSelect,
        },
        {
            title: 'E-Type',
            key: 'etype',
            values: etypes,
            setFn: handleEtypeSelect,
        },
    ];

    return (
        <>
            <Filters theme={theme} hasData={!!quickSelection.volume_section && !!quickSelection.mtype && !!quickSelection.etype}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title title="Voltage - Calcium Scan" subtitle="Predictions" theme={theme} />
                            <div role="information">
                                <InfoBox>
                                    <p>Changing the extracellular ionic concentrations is known to alter excitability of neurons. To model this effect, we varied over a realistic range changes in extracellular calcium and the tonic depolarization resulting from varying extracellular potassium concentration. Here, we report that for restricted parameter ranges only variable and irregular theta activity was generated in CA1.</p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                    <div className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center" style={{ maxWidth: '800px' }}>
                        <div className={`selector__column selector__column--lg mt-3 theme-${theme}`} style={{ maxWidth: "auto" }}>
                            <div className={`selector__head theme-${theme}`}>1. Select a volume section</div>
                            <div className="selector__body">
                                <VolumeSectionSelector3D value={getVolumeSection()} onSelect={handleVolumeSelect} theme={theme} />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
                            <div className={`selector__column theme-${theme} flex-1`} style={{ maxWidth: "auto" }}>
                                <div className={`selector__head theme-${theme}`}>2. Select extracellular conditions</div>
                                <div className="selector__body">
                                    <ScatterPlotSelector
                                        path={`5_prediction/voltage/${quickSelection.volume_section}/`}
                                        xRange={voltageSectionStructure[getVolumeSection()].CA_O}
                                        yRange={voltageSectionStructure[getVolumeSection()].K_Inj}
                                        xAxisLabel='Ca2+ (mM)'
                                        yAxisLabel='k_inj'
                                        theme={theme}
                                        onSelect={handleScatterPlotSelect}
                                        selectedX={quickSelection.ca_o as number}
                                        selectedY={quickSelection.k_inj as number}
                                    />
                                </div>
                            </div>
                            <div className={`selector__column theme-${theme} flex-1`}>
                                <div className={`selector__head theme-${theme}`}>3. Select cell types</div>
                                <div className="selector__body">
                                    <List block list={mtypes} value={quickSelection.mtype as string} title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`} onSelect={handleMtypeSelect} theme={theme} />
                                    <List block list={etypes} value={quickSelection.etype as string} title={`E-type ${etypes.length ? '(' + etypes.length + ')' : ''}`} onSelect={handleEtypeSelect} theme={theme} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Filters>
            <DataContainer theme={theme} navItems={[{ id: 'spikeTimeSection', label: "Spike Time" }, { id: 'meanFiringRateSection', label: "Mean Firing Rate" }, { id: 'traceSection', label: "Traces" }]} quickSelectorEntries={qsEntries}>

                <Collapsible id='spikeTimeSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Spike Time">
                    <div className="graph">
                        <TimeSpikePlot plotData={spikeTimeData} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(spikeTimeData, `spike-time-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.ca_o}-${quickSelection.k_inj}`)}>
                        Spike time{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.volume_section}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.ca_o}-{quickSelection.k_inj}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringRateData} xAxis={"Firing Rate (Hz)"} yAxis={"Frequency"} xAxisTickStep={0.1} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(meanFiringRateData, `mean-firing-trate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.ca_o}-${quickSelection.k_inj}`)}>
                        Mean Firing Rate{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.volume_section}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.ca_o}-{quickSelection.k_inj}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='traceSection' title="Traces">
                    <div className="graph">
                        <TraceGraph plotData={traceData} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(traceData, `mean-firing-trate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.ca_o}-${quickSelection.k_inj}`)}>
                        Trace{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.volume_section}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.ca_o}-{quickSelection.k_inj}</span>
                    </DownloadButton>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default VoltageView;