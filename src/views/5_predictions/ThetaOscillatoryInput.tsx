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
import models from "@/models.json";
import { dataPath } from '@/config';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import { volumeSections } from '@/constants';
import TraceGraph from './components/Trace';

const voltageSectionStructure = {
    cylinder: {
        cell_frequency: [0.1, 0.2, 0.3, 0.4],
        signal_frequency: [6, 8, 10]
    },
    region: {
        cell_frequency: [1, 2],
        signal_frequency: [4, 6, 8]
    },
    slice: {
        cell_frequency: [0.1, 0.2, 0.3, 0.4, 1, 2],
        signal_frequency: [4, 6, 8]
    }
};

const ThetaOscillatoryInputView: React.FC = () => {
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
        const { volume_section, mtype, etype, signal_frequency, cell_frequency } = router.query;
        const newQuickSelection: Record<string, string | number> = {};
        if (typeof volume_section === 'string') newQuickSelection.volume_section = volume_section;
        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof signal_frequency === 'string') newQuickSelection.signal_frequency = parseFloat(signal_frequency);
        if (typeof cell_frequency === 'string') newQuickSelection.cell_frequency = parseFloat(cell_frequency);
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
                signal_frequency: voltageSectionStructure[defaultSection].signal_frequency[0],
                cell_frequency: voltageSectionStructure[defaultSection].cell_frequency[0]
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { volume_section, signal_frequency, cell_frequency, mtype, etype } = quickSelection;
            if (signal_frequency === undefined || cell_frequency === undefined || !mtype || !etype || !volume_section) return;
            const baseUrl = `${dataPath}/5_prediction/theta-oscillation-input/${volume_section}/${cell_frequency}-${signal_frequency}/${mtype}-${etype}`;
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
        const newSelection = {
            ...quickSelection,
            volume_section,
            signal_frequency: voltageSectionStructure[volume_section].signal_frequency[0],
            cell_frequency: voltageSectionStructure[volume_section].cell_frequency[0]
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

    const handleScatterPlotSelect = (signal_frequency: number, cell_frequency: number) => {
        setQuickSelection(prev => ({ ...prev, signal_frequency, cell_frequency }));
        setParams({ signal_frequency, cell_frequency });
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
            title: 'Cell Frequency',
            key: 'cell_frequency',
            getValuesFn: () => voltageSectionStructure[getVolumeSection()].cell_frequency,
            sliderRange: voltageSectionStructure[getVolumeSection()].cell_frequency
        },
        {
            title: 'signal Frequency',
            key: 'signal_frequency',
            getValuesFn: () => voltageSectionStructure[getVolumeSection()].signal_frequency,
            sliderRange: voltageSectionStructure[getVolumeSection()].signal_frequency
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
                            <Title
                                title="Theta - Oscillatory input"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        To model the transmission of theta activity from CA3 to CA1, we generated individual random spike trains for each SC axon modulated by sinusoidal rate function (range 4-10 Hz). Here, we report how this induced a highly regular theta activity in CA1 that matched the stimulus frequency with homogeneous phase response of different morphological types. </p>
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
                                        path={`5_prediction/theta-oscillation-input/${quickSelection.volume_section}/`}
                                        xRange={voltageSectionStructure[getVolumeSection()].cell_frequency}
                                        yRange={voltageSectionStructure[getVolumeSection()].signal_frequency}
                                        xAxisLabel='signal_frequency'
                                        yAxisLabel='Cell Frequency'
                                        theme={theme}
                                        onSelect={handleScatterPlotSelect}
                                        selectedX={quickSelection.cell_frequency as number}
                                        selectedY={quickSelection.signal_frequency as number}
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
                </Collapsible>
                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringRateData} />
                    </div>
                </Collapsible>
                <Collapsible id='traceSection' title="Traces">
                    <TraceGraph plotData={traceData} />
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default ThetaOscillatoryInputView;