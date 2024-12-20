import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import SCDistibutionGraph from './schaffer-collaterals-1/SCDistibutionGraph';
import SynapseDensityProfileGraph from './schaffer-collaterals-1/SynapsesDensityProfileGraph';

import { dataPath } from '@/config';

interface JsonDataItem {
    name: string;
    // Add other properties as needed
}

interface JsonData {
    SynapsesConvergenceForPyramidalCells: JsonDataItem | null;
    SynapsesConvergenceForPyramidalCellsTwo: JsonDataItem | null;
    NumberOfSynapsesPerConections: JsonDataItem | null;
    Divergence: JsonDataItem | null;
    ESPS_IPSPLatency: JsonDataItem | null;
    HalfWidth: JsonDataItem | null;
    PSCRatioFromSCToCB1RPlus: JsonDataItem | null;
    PSCRatioFromSCToCB1RMinus: JsonDataItem | null;
    PSPAmplitude: JsonDataItem | null;
    RiseTime: JsonDataItem | null;
    TauDecay: JsonDataItem | null;
}

const SchafferCollateralsView: React.FC = () => {
    const theme = 4;
    const [jsonData, setJsonData] = useState<JsonData>({
        SynapsesConvergenceForPyramidalCells: null,
        SynapsesConvergenceForPyramidalCellsTwo: null,
        NumberOfSynapsesPerConections: null,
        Divergence: null,
        ESPS_IPSPLatency: null,
        HalfWidth: null,
        PSCRatioFromSCToCB1RPlus: null,
        PSCRatioFromSCToCB1RMinus: null,
        PSPAmplitude: null,
        RiseTime: null,
        TauDecay: null
    });

    useEffect(() => {
        const fetchData = async () => {
            const files = [
                dataPath + '/4_validations/schaffer-collaterals-1/anatomy/synapse-convergence-for-pyramidal-cells.json',
                dataPath + '/4_validations/schaffer-collaterals-1/anatomy/synapse-convergence-for-pyramidal-cells_2.json',
                dataPath + '/4_validations/schaffer-collaterals-1/anatomy/number-of-synapse-per-connection.json',
                dataPath + '/4_validations/schaffer-collaterals-1/anatomy/divergence.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/epsp-ipsp-latency-distribution.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/half-width-distribution.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/PSC-ratio-distribution-from-sc-to-cb1r+.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/PSC-ratio-distribution-from-sc-to-cb1r-.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/psp-amplitudes-distribution.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/rise-time-distribution.json',
                dataPath + '/4_validations/schaffer-collaterals-1/physiology/tau-decay-distribution.json'
            ];

            const fetchedData = await Promise.all(
                files.map(file =>
                    fetch(`${file}`).then(res => res.json())
                )
            );

            setJsonData({
                SynapsesConvergenceForPyramidalCells: fetchedData[0],
                SynapsesConvergenceForPyramidalCellsTwo: fetchedData[1],
                NumberOfSynapsesPerConections: fetchedData[2],
                Divergence: fetchedData[3],
                ESPS_IPSPLatency: fetchedData[4],
                HalfWidth: fetchedData[5],
                PSCRatioFromSCToCB1RPlus: fetchedData[6],
                PSCRatioFromSCToCB1RMinus: fetchedData[7],
                PSPAmplitude: fetchedData[8],
                RiseTime: fetchedData[9],
                TauDecay: fetchedData[10]
            });
        };

        fetchData();
    }, []);

    if (Object.values(jsonData).some(data => data === null)) {
        return <div>Loading data...</div>;
    }

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Schaffer Collaterals 1"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We validated the <Link className={`link theme-${theme}`} href={'/digital-reconstructions/schaffer-collaterals/'}> Schaffer collaterals</Link> using <Link className={`link theme-${theme}`} href={'/experimental-data/schaffer-collaterals/'}>available data on its anatomy</Link>. We compared the model with experimental data in terms of synapse profile, number of synapses per connection, convergence and divergence.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>
            <DataContainer theme={theme}
                navItems={[
                    { label: 'Anatomy', isTitle: true },
                    { id: 'AnatomyDensityOfSynapsesSection', label: 'Density of synapses along the radial axis' },
                    { id: 'SynapsesConvergenceForPyramidalCellsSection', label: jsonData.SynapsesConvergenceForPyramidalCells?.name || 'Synapses convergence dor pyramidal cells' },
                    { id: 'NumberOfSynapsesPerConectionsSection', label: jsonData.NumberOfSynapsesPerConections?.name || 'Number of synapses per connections' },
                    { id: 'SynapsesConvergenceForPyramidalCellsTwoSection', label: jsonData.SynapsesConvergenceForPyramidalCellsTwo?.name || 'Synapses Convergence For pyramidal cells two' },
                    { id: 'DivergenceSection', label: 'Anatomy ' + (jsonData.Divergence?.name || 'Divergence') },
                    { label: 'Physiology', isTitle: true },
                    { id: 'PSPAmplitudeSection', label: jsonData.PSPAmplitude?.name || 'PSP Amplitude' },
                    { id: 'PSCRatioFromSCToCB1RPlusSection', label: jsonData.PSCRatioFromSCToCB1RPlus?.name || 'PSC ratio from SC to CB1R+' },
                    { id: 'PSCRatioFromSCToCB1RMinusSection', label: jsonData.PSCRatioFromSCToCB1RMinus?.name || 'PSC ratio from SC to CB1R-' },
                    { id: 'TemporalDynamicsOfSCToPCSynapticTransmissionSection', label: 'Temporal dynamics of SC to PC synaptic transmission' },
                    { id: 'ESPS_IPSPLatencySection', label: jsonData.ESPS_IPSPLatency?.name || 'ESPS IPSP latency' },
                ]}>

                <Collapsible id="AnatomyDensityOfSynapsesSection" properties={["Anatomy"]} title={"Density of synapses along the radial axis"} >
                    <SynapseDensityProfileGraph theme={theme} />
                </Collapsible>

                {jsonData.SynapsesConvergenceForPyramidalCells && (
                    <Collapsible id="SynapsesConvergenceForPyramidalCellsSection" properties={["Anatomy"]} title={jsonData.SynapsesConvergenceForPyramidalCells.name}>
                        <SCDistibutionGraph
                            data={jsonData.SynapsesConvergenceForPyramidalCells}
                            xAxisTitle="Synapse Indegree from each CA1 PC"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.NumberOfSynapsesPerConections && (
                    <Collapsible id="NumberOfSynapsesPerConectionsSection" properties={["Anatomy"]} title={jsonData.NumberOfSynapsesPerConections.name}>
                        <SCDistibutionGraph
                            data={jsonData.NumberOfSynapsesPerConections}
                            xAxisTitle="Synapse Indegree from each CA1 INT"
                            yAxisTitle="Count"
                            isLogarithmic={true}
                            xTickInterval={1}
                        />
                    </Collapsible>
                )}

                {jsonData.SynapsesConvergenceForPyramidalCellsTwo && (
                    <Collapsible id="SynapsesConvergenceForPyramidalCellsTwoSection" properties={["Anatomy"]} title={jsonData.SynapsesConvergenceForPyramidalCellsTwo.name}>
                        <SCDistibutionGraph
                            data={jsonData.SynapsesConvergenceForPyramidalCellsTwo}
                            xAxisTitle="Synapses/Connection"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.Divergence && (
                    <Collapsible id="DivergenceSection" properties={["Anatomy"]} title={jsonData.Divergence.name}>
                        <SCDistibutionGraph
                            data={jsonData.Divergence}
                            xAxisTitle="Synapse Outdegree from each CA3 PC"
                            yAxisTitle=""
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.PSPAmplitude && (
                    <Collapsible id="PSPAmplitudeSection" properties={["Physiology"]} title={jsonData.PSPAmplitude.name}>
                        <SCDistibutionGraph
                            data={jsonData.PSPAmplitude}
                            xAxisTitle="PSP Amplitude (mV)"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.PSCRatioFromSCToCB1RPlus && (
                    <Collapsible id="PSCRatioFromSCToCB1RPlusSection" properties={["Physiology"]} title={jsonData.PSCRatioFromSCToCB1RPlus.name}>
                        <SCDistibutionGraph
                            data={jsonData.PSCRatioFromSCToCB1RPlus}
                            xAxisTitle="PSC Ratio"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.PSCRatioFromSCToCB1RMinus && (
                    <Collapsible id="PSCRatioFromSCToCB1RMinusSection" properties={["Physiology"]} title={jsonData.PSCRatioFromSCToCB1RMinus.name}>
                        <SCDistibutionGraph
                            data={jsonData.PSCRatioFromSCToCB1RMinus}
                            xAxisTitle="PSC Ratio"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.RiseTime && jsonData.TauDecay && jsonData.HalfWidth && (
                    <Collapsible id="TemporalDynamicsOfSCToPCSynapticTransmissionSection" properties={["Physiology"]} title={"Temporal dynamics of SC to PC synaptic transmission"}>
                        <h2 className="text-base  mb-2">{jsonData.RiseTime.name}</h2>
                        <SCDistibutionGraph
                            data={jsonData.RiseTime}
                            xAxisTitle="Rise Time (ms)"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />

                        <h2 className="text-base mt-16 mb-2">{jsonData.TauDecay.name}</h2>
                        <SCDistibutionGraph
                            data={jsonData.TauDecay}
                            xAxisTitle="Tau Decay (ms)"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />

                        <h2 className="text-base mt-16 mb-2">{jsonData.HalfWidth.name}</h2>
                        <SCDistibutionGraph
                            data={jsonData.HalfWidth}
                            xAxisTitle="Half-width (ms)"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

                {jsonData.ESPS_IPSPLatency && (
                    <Collapsible id="ESPS_IPSPLatencySection" properties={["Physiology"]} title={jsonData.ESPS_IPSPLatency.name}>
                        <SCDistibutionGraph
                            data={jsonData.ESPS_IPSPLatency}
                            xAxisTitle="EPSP IPSP Latency (ms)"
                            yAxisTitle="Count"
                            xTickInterval={5}
                        />
                    </Collapsible>
                )}

            </DataContainer>
        </>
    );
};

export default SchafferCollateralsView;