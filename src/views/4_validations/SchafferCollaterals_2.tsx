import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';

import models from "./models.json";
import { dataPath } from '@/config';
import { QuickSelectorEntry } from '@/types';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import TraceGraph from '../5_predictions/components/Trace';
import TimeSpikePlot from '../5_predictions/components/TimeSpikePlot';
import MeanFiringRatePlot from '../5_predictions/components/MeanFiringRatePlot';

const simAndSliceSeeds = ['10', '15', '20', '25', '30'];
const stimulusPercentOptions = ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
const maxSCOptions = ['350'];
const inhibitionOptions = ['0', '1'];

const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();

const formatInhibition = (value: string): string => value === '0' ? 'No Inhibition' : 'With Inhibition';

const SchafferCollateralsView: React.FC = () => {
    const router = useRouter();
    const theme = 4;

    const [quickSelection, setQuickSelection] = useState<Record<string, string>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);

    useEffect(() => {
        if (!router.isReady) return;

        const { mtype, etype, simAndSliceSeed, stimulusPercent, maxSC, inhibition } = router.query;
        const newQuickSelection: Record<string, string> = {};

        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof simAndSliceSeed === 'string') newQuickSelection.simAndSliceSeed = simAndSliceSeed;
        if (typeof stimulusPercent === 'string') newQuickSelection.stimulusPercent = stimulusPercent;
        if (typeof maxSC === 'string') newQuickSelection.maxSC = maxSC;
        if (typeof inhibition === 'string') newQuickSelection.inhibition = inhibition;

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
                simAndSliceSeed: simAndSliceSeeds[0],
                stimulusPercent: stimulusPercentOptions[0],
                maxSC: maxSCOptions[0],
                inhibition: inhibitionOptions[0],
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { simAndSliceSeed, stimulusPercent, maxSC, inhibition, mtype, etype } = quickSelection;
            if (!simAndSliceSeed || !stimulusPercent || !maxSC || !inhibition || !mtype || !etype) return;

            const dataTypes = [
                { name: 'spike-time', setter: setSpikeTimeData },
                { name: 'mean-firing-rate', setter: setMeanFiringRateData },
                { name: 'trace', setter: setTraceData }
            ];

            for (const { name, setter } of dataTypes) {
                try {
                    const response = await fetch(`${dataPath}/4_validations/schaffer-collaterals-2/${simAndSliceSeed}-${stimulusPercent}-${maxSC}-${inhibition}/${mtype}-${etype}/${name}.json`);
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

    const setParams = (params: Record<string, string>): void => {
        const newQuery = { ...router.query, ...params };
        router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
    };

    const handleSimAndSliceSeedSelect = (simAndSliceSeed: string) => {
        setQuickSelection(prev => ({ ...prev, simAndSliceSeed }));
        setParams({ simAndSliceSeed });
    }

    const handleStimulusPercentSelect = (stimulusPercent: string) => {
        setQuickSelection(prev => ({ ...prev, stimulusPercent }));
        setParams({ stimulusPercent });
    }

    const handleMaxSCSelect = (maxSC: string) => {
        setQuickSelection(prev => ({ ...prev, maxSC }));
        setParams({ maxSC });
    }

    const handleInhibitionSelect = (inhibition: string) => {
        setQuickSelection(prev => ({ ...prev, inhibition }));
        setParams({ inhibition });
    }

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

    const mtypes = getMtypes();
    const etypes = getEtypes(quickSelection.mtype || '');

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'Simulation and slice seed',
            key: 'simAndSliceSeed',
            values: simAndSliceSeeds,
            setFn: handleSimAndSliceSeedSelect,
        },
        {
            title: 'Stimulus Percent',
            key: 'stimulusPercent',
            values: stimulusPercentOptions,
            setFn: handleStimulusPercentSelect,
        },
        {
            title: 'Max SC',
            key: 'maxSC',
            values: maxSCOptions,
            setFn: handleMaxSCSelect,
        },
        {
            title: 'Inhibition',
            key: 'inhibition',
            values: inhibitionOptions,
            setFn: handleInhibitionSelect,
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
                                title="Schaffer Collaterals 2"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        After we validated the Schaffer collaterals at neuron and synapse level, we validated them at network level. In particular, we reproduced one of the experiments reported in Sasaki et al. (2006), where Schaffer collaterals are stimulated at different intensities with and without Gabazine (an antagonist of GABAA receptors). As in the experiment, the feedforward inhibition linearises the I-O response, while the I-O response saturates quickly when the inhibition is blocked. We repeated the simulations over three different slices.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none lg:pl-24">
                        <div className={`selector__column theme-${theme} w-full lg:w-1/2`}>
                            <div className={`selector__head theme-${theme}`}>Select a cell</div>
                            <div className="selector__body flex flex-col">
                                <List
                                    block
                                    list={mtypes}
                                    value={quickSelection.mtype}
                                    title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                                    onSelect={handleMtypeSelect}
                                    theme={theme}
                                    grow={true}
                                />
                                <List
                                    block
                                    list={etypes}
                                    value={quickSelection.etype}
                                    title={`E-type ${etypes.length ? '(' + etypes.length + ')' : ''}`}
                                    onSelect={handleEtypeSelect}
                                    theme={theme}
                                    grow={true}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 w-full lg:w-1/2">
                            <div className={`selector__column theme-${theme} w-full`}>
                                <div className={`selector__head theme-${theme}`}>Select parameters</div>
                                <div className="selector__body">
                                    <List
                                        block
                                        list={simAndSliceSeeds}
                                        value={quickSelection.simAndSliceSeed}
                                        title={`Simulation and slice seed ${simAndSliceSeeds.length ? '(' + simAndSliceSeeds.length + ')' : ''}`}
                                        onSelect={handleSimAndSliceSeedSelect}
                                        theme={theme}
                                        grow={true}
                                    />
                                </div>
                            </div>

                            <div className={`selector__column theme-${theme} w-full`}>
                                <div className={`selector__head theme-${theme}`}>Select parameters</div>
                                <div className="selector__body">
                                    <List
                                        block
                                        list={stimulusPercentOptions}
                                        value={quickSelection.stimulusPercent}
                                        title={`Stimulus percent ${stimulusPercentOptions.length ? '(' + stimulusPercentOptions.length + ')' : ''}`}
                                        onSelect={handleStimulusPercentSelect}
                                        theme={theme}
                                        grow={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8 w-full lg:w-1/2">
                            <div className={`selector__column theme-${theme} w-full`}>
                                <div className={`selector__head theme-${theme}`}>Select parameters</div>
                                <div className="selector__body">
                                    <List
                                        block
                                        list={maxSCOptions}
                                        value={quickSelection.maxSC}
                                        title={`Max SC ${maxSCOptions.length ? '(' + maxSCOptions.length + ')' : ''}`}
                                        onSelect={handleMaxSCSelect}
                                        theme={theme}
                                        grow={true}
                                    />
                                </div>
                            </div>

                            <div className={`selector__column theme-${theme} w-full`}>
                                <div className={`selector__head theme-${theme}`}>Select parameters</div>
                                <div className="selector__body">
                                    <List
                                        block
                                        list={inhibitionOptions.map(formatInhibition)}
                                        value={formatInhibition(quickSelection.inhibition || '0')}
                                        title={`Inhibition ${inhibitionOptions.length ? '(' + inhibitionOptions.length + ')' : ''}`}
                                        onSelect={(value: string) => handleInhibitionSelect(value === 'No Inhibition' ? '0' : '1')}
                                        theme={theme}
                                        grow={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Filters>
            <DataContainer
                theme={theme}
                navItems={[
                    { id: 'spikeTimeSection', label: "Spike Time" },
                    { id: 'traceSection', label: "Traces" }
                ]}
                quickSelectorEntries={qsEntries}
            >
                <Collapsible id='spikeTimeSection' properties={[quickSelection.simAndSliceSeed, quickSelection.stimulusPercent, quickSelection.maxSC, quickSelection.inhibition, quickSelection.mtype + "-" + quickSelection.etype]} title="Spike Time">
                    <div className="graph">
                        <TimeSpikePlot plotData={spikeTimeData} />
                    </div>
                </Collapsible>

                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringData} />
                    </div>

                </Collapsible>


                <Collapsible id='traceSection' properties={[quickSelection.simAndSliceSeed, quickSelection.stimulusPercent, quickSelection.maxSC, quickSelection.inhibition, quickSelection.mtype + "-" + quickSelection.etype]} title="Traces">
                    <div className="graph">
                        <TraceGraph plotData={traceData} />
                    </div>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default SchafferCollateralsView;