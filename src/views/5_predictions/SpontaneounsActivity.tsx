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

const MinisRate = [
    0.00025, 0.0005, 0.00075, 0.001, 0.00125, 0.0015, 0.00175, 0.002
];


const CA_O = [1, 1.5, 2];

const getMinisRate = (): number[] => MinisRate;
const getCa0 = (): number[] => CA_O;
const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();


const SpontaneousActivityView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);
    const [spikeTimePlotSvg, setSpikeTimePlotSvg] = useState<string | null>(null);

    useEffect(() => {
        if (!router.isReady) return;

        const { mtype, etype, ca_o, minis_rate } = router.query;
        const newQuickSelection: Record<string, string | number> = {};

        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof ca_o === 'string') newQuickSelection.ca_o = parseFloat(ca_o);
        if (typeof minis_rate === 'string') newQuickSelection.minis_rate = parseFloat(minis_rate);

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
                ca_o: CA_O[0],
                minis_rate: MinisRate[0]
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { ca_o, minis_rate, mtype, etype } = quickSelection;
            if (ca_o === undefined || minis_rate === undefined || !mtype || !etype) return;

            const baseUrl = `${dataPath}/5_prediction/spontaneous-activity/${ca_o}-${minis_rate}/${mtype}-${etype}`;

            const dataTypes = [
                { name: 'spike-time', setter: setSpikeTimeData },
                { name: 'mean-firing-rate', setter: setMeanFiringRateData },
                { name: 'trace', setter: setTraceData }
            ];

            for (const { name, setter } of dataTypes) {
                try {
                    const response = await fetch(`${baseUrl}/${name}.json`);
                    if (!response.ok) {
                        if (response.status === 404) {
                            console.warn(`${name} data not found`);
                            setter(null);
                        } else {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    } else {
                        const data = await response.json();
                        setter(data);
                    }
                } catch (error) {
                    console.error(`Error fetching ${name} data:`, error);
                    setter(null);
                }
            }

            // Fetch the spike-time-plot.svg
            try {
                const svgResponse = await fetch(`${baseUrl}/spike-time-plot.svg`);
                if (!svgResponse.ok) {
                    if (svgResponse.status === 404) {
                        console.warn('Spike time plot SVG not found');
                        setSpikeTimePlotSvg(null);
                    } else {
                        throw new Error(`HTTP error! status: ${svgResponse.status}`);
                    }
                } else {
                    const svgText = await svgResponse.text();
                    setSpikeTimePlotSvg(svgText);
                }
            } catch (error) {
                console.error('Error fetching spike-time-plot.svg:', error);
                setSpikeTimePlotSvg(null);
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

    const handleScatterPlotSelect = (ca_o: number, minis_rate: number) => {
        setQuickSelection(prev => ({ ...prev, ca_o, minis_rate }));
        setParams({ ca_o, minis_rate });
    };

    const mtypes = getMtypes();
    const etypes = getEtypes(quickSelection.mtype as string);

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'CA_0',
            key: 'ca_o',
            getValuesFn: getCa0,
            sliderRange: CA_O
        },
        {
            title: 'Minis Rate',
            key: 'minis_rate',
            getValuesFn: getMinisRate,
            sliderRange: MinisRate
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



    function getPlotDataById(arg0: string): any {
        throw new Error('Function not implemented.');
    }

    return (
        <>

            <Filters theme={theme}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Spontaneous Activity"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div className='w-full' role="information">
                                <InfoBox>
                                    <p>
                                        We simulated the network using different levels of spontaneous synaptic release (0.00025 - 0.002 Hz) and different extracellular calcium concentration (1 - 2 mM). These simulations can give a prediction on how the CA1 could behave without any external inputs at in vivo or in vitro extracellular calcium concentrations (respectively 1 and 2 mM). In these conditions, the activity is very sparse and irregular.
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
                                    path="5_prediction/spontaneous-activity/"
                                    xRange={CA_O}
                                    yRange={MinisRate}
                                    xAxisLabel='Ca2+ (mM)'
                                    yAxisLabel='Spontaneous synaptic release (Hz)'
                                    theme={theme}
                                    onSelect={handleScatterPlotSelect}
                                    selectedX={quickSelection.ca_o as number}
                                    selectedY={quickSelection.minis_rate as number}
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
                        {spikeTimePlotSvg ? (
                            <div className="svg-container" style={{ width: '100%', height: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div dangerouslySetInnerHTML={{ __html: spikeTimePlotSvg }} className="svg-content" />
                            </div>
                        ) : (
                            <p>Spike time plot not available</p>
                        )}
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => spikeTimeData && downloadAsJson(spikeTimeData, `spike-time-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.minis_rate}-${quickSelection.ca_o}`)}
                    >
                        Spike time{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.minis_rate}-{quickSelection.ca_o}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringRateData} xAxis={"Firing Rate (Hz)"} yAxis={"Frequency"} xAxisTickStep={0.1} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(meanFiringRateData, `mean-firing-trate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.minis_rate}-${quickSelection.ca_o}`)}>
                        Mean Firing Rate{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.minis_rate}-{quickSelection.ca_o}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='traceSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Traces">
                    <div className="graph">
                        <TraceGraph plotData={traceData} />
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(traceData, `mean-firing-trate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.minis_rate}-${quickSelection.ca_o}`)}>
                        Trace{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.minis_rate}-{quickSelection.ca_o}</span>
                    </DownloadButton>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default SpontaneousActivityView;
