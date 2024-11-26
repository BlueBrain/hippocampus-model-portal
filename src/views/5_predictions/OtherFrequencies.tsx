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
import { basePath, dataPath } from '@/config';
import { volumeSections } from '@/constants';
import TraceGraph from './components/Trace';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import DistributionPlot from '@/components/DistributionPlot';

const cell_frequency: number[] = [0.1, 0.2, 0.4, 0.8];
const signal_frequency: number[] = [0, 1, 2, 4, 6, 8, 10, 12, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200];

const OtherFrequenciesView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);
    const [spikeTimePlotSvg, setSpikeTimePlotSvg] = useState<string | null>(null);

    const getMtypes = (): string[] => [...new Set(models.map(model => model.mtype))].sort();
    const getEtypes = (mtype: string): string[] => [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();

    useEffect(() => {
        if (!router.isReady) return;
        const { mtype, etype, signal_frequency: querySignalFreq, cell_frequency: queryCellFreq } = router.query;
        const newQuickSelection: Record<string, string | number> = {};
        if (typeof mtype === 'string') newQuickSelection.mtype = mtype;
        if (typeof querySignalFreq === 'string') newQuickSelection.signal_frequency = parseFloat(querySignalFreq);
        if (typeof queryCellFreq === 'string') newQuickSelection.cell_frequency = parseFloat(queryCellFreq);
        if (typeof mtype === 'string') {
            const availableEtypes = getEtypes(mtype);
            newQuickSelection.etype = typeof etype === 'string' && availableEtypes.includes(etype) ? etype : availableEtypes[0] || '';
        }
        setQuickSelection(newQuickSelection);
        if (Object.keys(newQuickSelection).length === 0) {
            const defaultMtype = getMtypes()[0];
            const defaultSelection = {
                mtype: defaultMtype,
                etype: getEtypes(defaultMtype)[0] || '',
                signal_frequency: signal_frequency[0],
                cell_frequency: cell_frequency[0]
            };
            setQuickSelection(defaultSelection);
            router.replace({ query: defaultSelection }, undefined, { shallow: true });
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            const { signal_frequency, cell_frequency, mtype, etype } = quickSelection;
            if (signal_frequency === undefined || cell_frequency === undefined || !mtype || !etype) return;
            const baseUrl = `${dataPath}/5_prediction/other-frequencies/${cell_frequency}-${signal_frequency}/${mtype}-${etype}`;
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

    const handleVolumeSelect = (volume_section: VolumeSection) => {
        const newSelection = {
            ...quickSelection,
            volume_section,
            signal_frequency: signal_frequency[0],
            cell_frequency: cell_frequency[0]
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

    const handleScatterPlotSelect = (cell_frequency: number, signal_frequency: number) => {
        setQuickSelection(prev => ({ ...prev, signal_frequency, cell_frequency }));
        setParams({ signal_frequency, cell_frequency });
    };

    const mtypes = getMtypes();
    const etypes = getEtypes(quickSelection.mtype as string);

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'Cell Frequency',
            key: 'cell_frequency',
            getValuesFn: () => cell_frequency,
            sliderRange: cell_frequency
        },
        {
            title: 'Signal Frequency',
            key: 'signal_frequency',
            getValuesFn: () => signal_frequency,
            sliderRange: signal_frequency
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
            <Filters theme={theme} hasData={!!quickSelection.mtype && !!quickSelection.etype}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Other Frequencies"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We stimulated the Schaffer collaterals (SC) at different mean frequencies (0.1-0.8 Hz) (cell_frequency). The signal is further modulated with a sinusoidal function of different frequencies (0.5-200 Hz) (signal_frequency). In general, CA1 activity reliably follows the same signal rhythm favoring intermediated frequencies (1 - 30 Hz).
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                    <div className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center" style={{ maxWidth: '800px' }}>
                        <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
                            <div className={`selector__column theme-${theme} flex-1`} style={{ maxWidth: "auto" }}>
                                <div className={`selector__head theme-${theme}`}>2. Select extracellular conditions</div>
                                <div className="selector__body">
                                    <ScatterPlotSelector
                                        path={`5_prediction/other-frequencies/`}
                                        xRange={cell_frequency}
                                        yRange={signal_frequency}
                                        xAxisLabel='Cell Frequency'
                                        yAxisLabel='Signal Frequency'
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
                        {spikeTimePlotSvg ? (
                            <div className="svg-container" style={{ width: '100%', height: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div dangerouslySetInnerHTML={{ __html: spikeTimePlotSvg }} className="svg-content" />
                            </div>
                        ) : (
                            <TimeSpikePlot plotData={spikeTimeData} />
                        )}
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(spikeTimeData, `spike-time-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.signal_frequency}-${quickSelection.cell_frequency}`)}>
                        Spike time{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.signal_frequency}-{quickSelection.cell_frequency}</span>
                    </DownloadButton>
                </Collapsible>
                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                <p>Distribution of neuron firing rate. We excluded first 1000 ms and sampled a maximum of 100 random neurons<sup>*</sup>.</p>

                    <div className="graph">
                        <MeanFiringRatePlot plotData={meanFiringRateData} xAxis={"Firing Rate (Hz)"} yAxis={"Frequency"} xAxisTickStep={0.05} />
                    </div>
                    <small>
                        <sup>[*]</sup> We may see an empty mean firing rate plot, even though there are spikes in the network (see <a href="#spikeTimeSection">Spike Time</a> section). This is because the plot is based on a sample of 100 neurons, none of which may spike at low firing rates.
                    </small>
                    <br />
                    <br />                   
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(meanFiringRateData, `mean-firing-rate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.signal_frequency}-${quickSelection.cell_frequency}`)}>
                        Mean Firing Rate{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.signal_frequency}-{quickSelection.cell_frequency}</span>
                    </DownloadButton>
                </Collapsible>
                <Collapsible id='traceSection' title="Traces">
                    <div className="graph">
                        <TraceGraph plotData={traceData} maxTime={6000}/>
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => downloadAsJson(traceData, `trace-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.signal_frequency}-${quickSelection.cell_frequency}`)}>
                        Trace{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.signal_frequency}-{quickSelection.cell_frequency}</span>
                    </DownloadButton>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default OtherFrequenciesView;
