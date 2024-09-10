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
import MeanFiringRatePlot from '../5_predictions/components/MeanFiringRatePlot';
import TimeSpikePlot from '../5_predictions/components/TimeSpikePlot';

const concentration = [0, 1, 5, 10, 20, 50, 100, 200, 500, 1000];

const getConcentration = (): number[] => concentration;
const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();

const AcetylcholineView: React.FC = () => {
    const router = useRouter();
    const theme = 4;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);

    useEffect(() => {
        if (!router.isReady) return;

        const { mtype, etype, concentration } = router.query;
        const newQuickSelection: Record<string, string | number> = {};

        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof concentration === 'string') newQuickSelection.concentration = parseFloat(concentration);

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
                concentration: 0,
                mtype: defaultMtype,
                etype: getEtypes(defaultMtype)[0] || '',
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchSpikeTimeData = async () => {
            const { concentration } = quickSelection;
            if (concentration === undefined) return;

            try {
                const response = await fetch(`${dataPath}/4_validations/acetylcholine/${concentration}/spike-time.json`);
                const data = await response.json();
                setSpikeTimeData(data);
                console.log('Spike-time data fetched:', data);
            } catch (error) {
                console.error('Error fetching spike-time data:', error);
                setSpikeTimeData(null);
            }
        };

        fetchSpikeTimeData();
    }, [quickSelection.concentration]);

    useEffect(() => {
        const fetchOtherData = async () => {
            const { concentration, mtype, etype } = quickSelection;
            if (concentration === undefined || !mtype || !etype) return;

            const otherDataTypes = [
                { name: 'mean-firing-rate', setter: setMeanFiringRateData },
                { name: 'trace', setter: setTraceData }
            ];

            for (const { name, setter } of otherDataTypes) {
                try {
                    const response = await fetch(`${dataPath}/4_validations/acetylcholine/${concentration}/${mtype}-${etype}/${name}.json`);
                    const data = await response.json();
                    setter(data);
                } catch (error) {
                    console.error(`Error fetching ${name} data:`, error);
                    setter(null);
                }
            }
        };

        fetchOtherData();
    }, [quickSelection]);

    const setParams = (params: Record<string, string | number>): void => {
        const newQuery = { ...router.query, ...params };
        router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
    };

    const handleConcentrationSelect = (concentration: string) => {
        const numConcentration = parseFloat(concentration);
        setQuickSelection(prev => ({ ...prev, concentration: numConcentration }));
        setParams({ concentration: numConcentration });
        console.log('Concentration changed:', numConcentration);
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

    const concentrations = getConcentration();
    const mtypes = getMtypes();
    const etypes = getEtypes(quickSelection.mtype as string);

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'Concentration',
            key: 'concentration',
            values: concentrations,
            setFn: handleConcentrationSelect,
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
                                title="Acetylcholine"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We validated the impact of acetylcholine at network level using <Link className={`link theme-${theme}`} href={'/experimental-data/acetylcholine/'}>available data from literature</Link>. As in the experiments, we observe different network dynamics depending on the concentration of acetylcholine.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none">
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Select a cell</div>
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
                            <div className={`selector__head theme-${theme}`}>Select a concentration</div>
                            <div className="selector__body">
                                <List
                                    block
                                    list={concentrations.map(String)}
                                    value={String(quickSelection.concentration)}
                                    title={`Concentration ${concentrations.length ? '(' + concentrations.length + ')' : ''}`}
                                    onSelect={handleConcentrationSelect}
                                    theme={theme}
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
                <Collapsible id='spikeTimeSection' title="Spike Time">
                    <div className="graph">
                        <TimeSpikePlot plotData={spikeTimeData} />
                    </div>
                </Collapsible>

                <Collapsible id='meanFiringRateSection' properties={[quickSelection.concentration + "", quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringRateData} />
                    </div>
                </Collapsible>

                <Collapsible id='traceSection' properties={[quickSelection.concentration + "", quickSelection.mtype + "-" + quickSelection.etype]} title="Traces">
                    <div className="graph">
                        <TraceGraph plotData={traceData} />
                    </div>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default AcetylcholineView;