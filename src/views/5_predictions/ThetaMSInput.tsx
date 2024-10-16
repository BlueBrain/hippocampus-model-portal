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
import DistributionPlot from '@/components/DistributionPlot';

const ACh = [0, 0.1, 1, 3, 5];
const Depolarisation = [105, 120, 125]; // Updated to include all unique values

const getaCh = (): number[] => ACh;
const getDepolarisation = (): number[] => Depolarisation;
const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();

const ThetaMSInputView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);

    useEffect(() => {
        if (!router.isReady) return;

        const { mtype, etype, ach, depolarisation } = router.query;
        const newQuickSelection: Record<string, string | number> = {};

        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof ach === 'string') newQuickSelection.ach = parseFloat(ach);
        if (typeof depolarisation === 'string') newQuickSelection.depolarisation = parseFloat(depolarisation);

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
                ach: ACh[0],
                depolarisation: Depolarisation[0]
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { ach, depolarisation, mtype, etype } = quickSelection;
            if (ach === undefined || depolarisation === undefined || !mtype || !etype) return;

            const baseUrl = `${dataPath}/5_prediction/theta-ms-input/${ach}-${depolarisation}/${mtype}-${etype}`;

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
            title: 'ACH',
            key: 'ach',
            getValuesFn: getaCh,
            sliderRange: ACh
        },
        {
            title: 'Depolarisation',
            key: 'depolarisation',
            getValuesFn: getDepolarisation,
            sliderRange: Depolarisation
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
                                        In the absence of medial septum (MS) region, we imitated its effect through a tonic depolarisation to represent in vivo background activity and an additional depolarisation corresponding arhythmic ACh release applied to all neurons and theta-range oscillatory hyperpolarizing current applied to PV+ interneurons only. The latter models the rhythmic disinhibition of CA1 observed in vivo. Here, we report how this induced regular theta activity in CA1 with heterogeneous phase response of different morphological types.
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
                                    xRange={ACh}
                                    yRange={Depolarisation}
                                    xAxisLabel='Acetylcholine concentration'
                                    yAxisLabel='Depolarisation'
                                    theme={theme}
                                    onSelect={handleScatterPlotSelect}
                                    selectedX={quickSelection.ach as number}
                                    selectedY={quickSelection.depolarisation as number}
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
                        onClick={() => downloadAsJson(spikeTimeData, `spike-time-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.ach}-${quickSelection.depolarisation}`)}>
                        Spike time{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.ach}-{quickSelection.depolarisation}</span>
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
                        <span className="!ml-0 collapsible-property small">{quickSelection.ach}-{quickSelection.depolarisation}</span>
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
                        <span className="!ml-0 collapsible-property small">{quickSelection.ach}-{quickSelection.depolarisation}</span>
                    </DownloadButton>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default ThetaMSInputView;