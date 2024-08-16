import React from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import SCDistibutionGraph from './schaffer-collaterals-1/SCDistibutionGraph';

// Anatomy
import SynapseDensityProfileGraph from './schaffer-collaterals-1/anatomy/SynapsesDensityProfileGraph';
import SynapsesConvergenceForPyramidalCellsData from './schaffer-collaterals-1/anatomy/synapse-convergence-for-pyramidal-cells.json';
import SynapsesConvergenceForPyramidalCellsTwoData from './schaffer-collaterals-1/anatomy/synapse-convergence-for-pyramidal-cells_2.json';
import NumberOfSynapsesPerConectionsData from './schaffer-collaterals-1/anatomy/number-of-synapse-per-connection.json';
import DivergenceData from './schaffer-collaterals-1/anatomy/divergence.json';


// Physiology
import ESPS_IPSPLatencyData from './schaffer-collaterals-1/physiology/epsp-ipsp-latency-distribution.json';
import HalfWidthData from './schaffer-collaterals-1/physiology/half-width-distribution.json';
import PSCRatioFromSCToCB1RPlusData from './schaffer-collaterals-1/physiology/PSC-ratio-distribution-from-sc-to-cb1r+.json';
import PSCRatioFromSCToCB1RMinusData from './schaffer-collaterals-1/physiology/PSC-ratio-distribution-from-sc-to-cb1r-.json';
import PSPAmplitudeData from './schaffer-collaterals-1/physiology/psp-amplitudes-distribution.json';
import RiseTImeData from './schaffer-collaterals-1/physiology/rise-time-distribution.json';
import TauDecayData from './schaffer-collaterals-1/physiology/tau-decay-distribution.json';






const SchafferCollateralsView: React.FC = () => {

    const theme = 4;

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
                    { id: 'SynapsesConvergenceForPyramidalCellsSection', label: SynapsesConvergenceForPyramidalCellsData.name },
                    { id: 'NumberOfSynapsesPerConectionsSection', label: NumberOfSynapsesPerConectionsData.name },
                    { id: 'SynapsesConvergenceForPyramidalCellsTwoSection', label: SynapsesConvergenceForPyramidalCellsTwoData.name },
                    { id: 'DivergenceSection', label: 'Anatomy ' + DivergenceData.name },
                    { label: 'Physiology', isTitle: true },
                    { id: 'PSPAmplitudeSection', label: PSPAmplitudeData.name },
                    { id: 'PSCRatioFromSCToCB1RPlusSection', label: PSCRatioFromSCToCB1RPlusData.name },
                    { id: 'PSCRatioFromSCToCB1RMinusSection', label: PSCRatioFromSCToCB1RMinusData.name },
                    { id: 'TemporalDynamicsOfSCToPCSynapticTransmissionSection', label: 'Temporal Dynamics of SC to PC Synaptic Transmission' },
                    { id: 'ESPS_IPSPLatencySection', label: ESPS_IPSPLatencyData.name },
                ]}>

                <Collapsible id="AnatomyDensityOfSynapsesSection" properties={["Anatomy"]} title={"Density of synapses along the radial axis"} >
                    <SynapseDensityProfileGraph />
                </Collapsible>

                <Collapsible id="SynapsesConvergenceForPyramidalCellsSection" properties={["Anatomy"]} title={SynapsesConvergenceForPyramidalCellsData.name}>
                    <SCDistibutionGraph
                        data={SynapsesConvergenceForPyramidalCellsData}
                        xAxisTitle="Synapse Indegree from each CA1 PC"
                        yAxisTitle="Count"
                    />
                </Collapsible>

                <Collapsible id="NumberOfSynapsesPerConectionsSection" properties={["Anatomy"]} title={NumberOfSynapsesPerConectionsData.name}>
                    <SCDistibutionGraph
                        data={NumberOfSynapsesPerConectionsData}
                        xAxisTitle="Synapse Indegree from each CA1 INT"
                        yAxisTitle="Count"
                        isLogarithmic={true}
                    />
                </Collapsible>

                <Collapsible id="SynapsesConvergenceForPyramidalCellsTwoSection" properties={["Anatomy"]} title={SynapsesConvergenceForPyramidalCellsTwoData.name}>
                    <SCDistibutionGraph
                        data={SynapsesConvergenceForPyramidalCellsTwoData}
                        xAxisTitle="Synapses/Connection"
                        yAxisTitle="Count"
                    />
                </Collapsible>

                <Collapsible id="DivergenceSection" properties={["Anatomy"]} title={DivergenceData.name}>
                    <SCDistibutionGraph
                        data={DivergenceData}
                        xAxisTitle="Synapse Outdegree from each CA3 PC"
                        yAxisTitle=""
                    />
                </Collapsible>

                <Collapsible id="PSPAmplitudeSection" properties={["Physiology"]} title={PSPAmplitudeData.name}>
                    <SCDistibutionGraph
                        data={PSPAmplitudeData}
                        xAxisTitle="PSP Amplitude (mV)"
                        yAxisTitle="Count"
                    />
                </Collapsible>

                <Collapsible id="PSCRatioFromSCToCB1RPlusSection" properties={["Physiology"]} title={PSCRatioFromSCToCB1RPlusData.name}>
                    <SCDistibutionGraph
                        data={PSCRatioFromSCToCB1RPlusData}
                        xAxisTitle="PSC Ratio"
                        yAxisTitle="Count"
                    />
                </Collapsible>

                <Collapsible id="PSCRatioFromSCToCB1RMinusSection" properties={["Physiology"]} title={PSCRatioFromSCToCB1RMinusData.name}>
                    <SCDistibutionGraph
                        data={PSCRatioFromSCToCB1RMinusData}
                        xAxisTitle="PSC Ratio"
                        yAxisTitle="Count"
                    />
                </Collapsible>

                <Collapsible id="TemporalDynamicsOfSCToPCSynapticTransmissionSection" properties={["Physiology"]} title={"Temporal Dynamics of SC to PC Synaptic Transmission"}>

                    <h2 className="text-base  mb-2">{RiseTImeData.name}</h2>
                    <SCDistibutionGraph
                        data={RiseTImeData}
                        xAxisTitle="Rise Time (ms)"
                        yAxisTitle="Count"
                    />

                    <h2 className="text-base mt-16 mb-2">{TauDecayData.name}</h2>
                    <SCDistibutionGraph
                        data={TauDecayData}
                        xAxisTitle="Tau Decay (ms)"
                        yAxisTitle="Count"
                    />

                    <h2 className="text-base mt-16 mb-2">{HalfWidthData.name}</h2>
                    <SCDistibutionGraph
                        data={HalfWidthData}
                        xAxisTitle="Half-width (ms)"
                        yAxisTitle="Count"
                    />

                </Collapsible>

                <Collapsible id="ESPS_IPSPLatencySection" properties={["Physiology"]} title={ESPS_IPSPLatencyData.name}>
                    <SCDistibutionGraph
                        data={ESPS_IPSPLatencyData}
                        xAxisTitle="EPSP IPSP Latency (ms)"
                        yAxisTitle="Count"
                    />
                </Collapsible>

            </DataContainer >
        </>
    );
};


export default SchafferCollateralsView;
