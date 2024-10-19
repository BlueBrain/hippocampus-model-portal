import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Filters from '@/layouts/Filters';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import MeanFiringRatePlot from './components/MeanFiringRatePlot';
import TraceGraph from './components/Trace';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import { dataPath } from '@/config';
// ... other imports ...

const OtherFrequenciesView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [quickSelection, setQuickSelection] = useState<Record<string, string | number>>({});
    const [spikeTimeData, setSpikeTimeData] = useState<any>(null);
    const [meanFiringRateData, setMeanFiringRateData] = useState<any>(null);
    const [traceData, setTraceData] = useState<any>(null);
    const [spikeTimePlotSvg, setSpikeTimePlotSvg] = useState<string | null>(null);

    // ... other state and functions ...

    useEffect(() => {
        const fetchData = async () => {
            const { frequency, mtype, etype } = quickSelection;
            if (!frequency || !mtype || !etype) return;

            const baseUrl = `${dataPath}/5_prediction/other-frequencies/${frequency}/${mtype}-${etype}`;

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

    // ... other functions ...

    return (
        <>
            <Filters theme={theme} hasData={!!quickSelection.frequency && !!quickSelection.mtype && !!quickSelection.etype}>
                {/* ... filter components ... */}
            </Filters>
            <DataContainer theme={theme} navItems={[{ id: 'spikeTimeSection', label: "Spike Time" }, { id: 'meanFiringRateSection', label: "Mean Firing Rate" }, { id: 'traceSection', label: "Traces" }]} quickSelectorEntries={qsEntries}>

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
                        onClick={() => spikeTimeData && downloadAsJson(spikeTimeData, `spike-time-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.frequency}`)}
                    >
                        Spike time{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.frequency}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='meanFiringRateSection' properties={[quickSelection.mtype + "-" + quickSelection.etype]} title="Mean Firing Rate">
                    <div className="graph">
                        {meanFiringRateData ? (
                            <MeanFiringRatePlot plotData={meanFiringRateData} xAxis={"Firing Rate (Hz)"} yAxis={"Frequency"} xAxisTickStep={0.1} />
                        ) : (
                            <p>Mean firing rate data not available</p>
                        )}
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => meanFiringRateData && downloadAsJson(meanFiringRateData, `mean-firing-rate-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.frequency}`)}
                    >
                        Mean Firing Rate{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.frequency}</span>
                    </DownloadButton>
                </Collapsible>

                <Collapsible id='traceSection' title="Traces">
                    <div className="graph">
                        {traceData ? (
                            <TraceGraph plotData={traceData} />
                        ) : (
                            <p>Trace data not available</p>
                        )}
                    </div>
                    <DownloadButton
                        theme={theme}
                        onClick={() => traceData && downloadAsJson(traceData, `trace-${quickSelection.mtype}-${quickSelection.etype}_${quickSelection.frequency}`)}
                    >
                        Trace{"  "}
                        <span className="!ml-0 collapsible-property small">{quickSelection.mtype}-{quickSelection.etype}</span>
                        <span className="!ml-0 collapsible-property small">{quickSelection.frequency}</span>
                    </DownloadButton>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default OtherFrequenciesView;
