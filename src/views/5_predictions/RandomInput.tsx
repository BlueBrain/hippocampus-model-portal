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

import { QuickSelectorEntry } from '@/types';
import models from "./models.json";
import { dataPath } from '@/config';
import DownloadButton from '@/components/DownloadButton';
import TraceGraph from './components/Trace';
import { downloadAsJson } from '@/utils';

const SCInputFreq = [];
const CAO = [];

const getSCInputFreq = (): number[] => SCInputFreq;
const getCAO = (): number[] => CAO;
const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();

const RandomInputView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);

    useEffect(() => {
        if (!router.isReady) return;

        const { mtype, etype, scInputFreq, cao } = router.query;
        const newQuickSelection: Record<string, string | number> = {};

        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof scInputFreq === 'string') newQuickSelection.scInputFreq = parseFloat(scInputFreq);
        if (typeof cao === 'string') newQuickSelection.cao = parseFloat(cao);

        if (typeof mtype === 'string') {
            const availableEtypes = getEtypes(mtype);
            if (typeof etype === 'string' && availableEtypes.includes(etype)) {
                newQuickSelection.etype = etype;
            } else {
                newQuickSelection.etype = availableEtypes[0] || '';
            }
        }

        setQuickSelection(newQuickSelection);

        if (Object.keys(newQuickSelection).length === 0) {
            const defaultMtype = getMtypes()[0];
            const defaultSelection = {
                mtype: defaultMtype,
                etype: getEtypes(defaultMtype)[0] || '',
                scInputFreq: SCInputFreq[0],
                cao: CAO[0]
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { scInputFreq, cao, mtype, etype } = quickSelection;
            if (scInputFreq === undefined || cao === undefined || !mtype || !etype) return;

            const baseUrl = `${dataPath}/5_prediction/random-input/${scInputFreq}-${cao}/${mtype}-${etype}`;

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

    const handleScatterPlotSelect = (ach: number, depolarisation: number) => {
        setQuickSelection(prev => ({ ...prev, ach, depolarisation }));
        setParams({ ach, depolarisation });
    };

    const mtypes = getMtypes();
    const etypes = getEtypes(quickSelection.mtype as string);

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'SC Input Frequency',
            key: 'scInputFreq',
            getValuesFn: getSCInputFreq,
            sliderRange: SCInputFreq
        },
        {
            title: 'CaO',
            key: 'cao',
            getValuesFn: getCAO,
            sliderRange: CAO
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
            <Filters theme={theme}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Theta - MS input"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none">
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Select reconstruction</div>
                            <div className="selector__body">
                                <List
                                    block
                                    list={mtypes}
                                    value={quickSelection.mtype as string}
                                    title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                                    onSelect={handleMtypeSelect}
                                    theme={theme}
                                />
                                <List
                                    block
                                    list={etypes}
                                    value={quickSelection.etype as string}
                                    title={`E-type ${etypes.length ? '(' + etypes.length + ')' : ''}`}
                                    onSelect={handleEtypeSelect}
                                    theme={theme}
                                />
                            </div>
                        </div>
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Configure</div>
                            <div className="selector__body">
                                <ScatterPlotSelector
                                    path="5_prediction/theta-ms-input/"
                                    xRange={SCInputFreq}
                                    yRange={CAO}
                                    xAxisLabel='SC Input Frequency'
                                    yAxisLabel='CaO'
                                    theme={theme}
                                    onSelect={handleScatterPlotSelect}
                                    selectedX={quickSelection.scInputFreq as number}
                                    selectedY={quickSelection.cao as number}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Filters>

            <DataContainer
                theme={theme}
                navItems={[
                    { id: 'spikeTimeSection', label: "Spike Time" },
                    { id: 'meanFiringRateSection', label: "Mean Firing Rate" },
                    { id: 'traceSection', label: "Traces" }
                ]}
                quickSelectorEntries={qsEntries}
            >
                <Collapsible id='spikeTimeSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Spike Time">
                    <div className="graph">
                        <TimeSpikePlot plotData={spikeTimeData} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(spikeTimeData, `spike-time-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.scInputFreq}-${quickSelection.cao}`)}>
                        Spike time{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.scInputFreq}-{quickSelection.cao}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringRateData} xAxis={"Firing Rate (Hz)"} yAxis={"Frequency"} xAxisTickStep={0.1} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(meanFiringRateData, `mean-firing-trate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.ach}-${quickSelection.depolarisation}`)}>
                        Mean Firing Rate{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.scInputFreq}-{quickSelection.cao}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='traceSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Traces">
                    <div className="graph">
                        <TraceGraph plotData={traceData} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(traceData, `mean-firing-trate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.ach}-${quickSelection.depolarisation}`)}>
                        Trace{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.scInputFreq}-{quickSelection.cao}</span>
                    </DownloadButton>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default RandomInputView;