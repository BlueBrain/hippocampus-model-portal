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
                                        We validated the <Link className={`link theme-${theme}`} href={'/digital-reconstructions/schaffer-collaterals/'}> Schaffer collaterals</Link> using <Link className={`link theme-${theme}`} href={'/experimental-data/schaffer-collaterals/'}>available data on its anatomy and physiology</Link>.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>
            <DataContainer theme={theme}
                navItems={[
                    { id: 'anatomySection', label: 'Anatomy' },
                    { id: 'physiologySection', label: 'Physiology' },
                ]}>

                <Collapsible id="anatomySection" title={`Anatomy`}>
                    <p>We compared the model with experimental data in terms of synapse profile, number of synapses per connection, convergence and divergence.
                    </p>
                    <h2 className="text-lg mt-8">Density of synapses along the radial axis</h2>
                    <div className="mt-2"> <SynapseDensityProfileGraph /></div>

                    <h2 className="text-lg mt-16 mb-2">{SynapsesConvergenceForPyramidalCellsData.name}</h2>
                    <SCDistibutionGraph
                        data={SynapsesConvergenceForPyramidalCellsData}
                        xAxisTitle="Synapse Indegree from each CA1 PC"
                        yAxisTitle="Count"
                    />

                    <h2 className="text-lg mt-8 mb-2">{NumberOfSynapsesPerConectionsData.name}</h2>
                    <SCDistibutionGraph
                        data={NumberOfSynapsesPerConectionsData}
                        xAxisTitle="Synapse Indegree from each CA1 INT"
                        yAxisTitle="Count"
                        isLogarithmic={true}
                    />

                    <h2 className="text-lg mt-8 mb-2">{SynapsesConvergenceForPyramidalCellsTwoData.name}</h2>
                    <SCDistibutionGraph
                        data={SynapsesConvergenceForPyramidalCellsTwoData}
                        xAxisTitle="Synapses/Connection"
                        yAxisTitle="Count"
                    />

                    <h2 className="text-lg mt-8 mb-2">{DivergenceData.name}</h2>
                    <SCDistibutionGraph
                        data={DivergenceData}
                        xAxisTitle="Synapse Outdegree from each CA3 PC"
                        yAxisTitle=""
                    />



                    {/*
                    SynapsesConvergenceForPyramidalCellsTwoData

                    <h2 className="text-lg mt-8 mb-2">{SynapsesConvergenceForPyramidalCellsData_2.name}</h2>
                    <SCDistibutionGraph
                        data={SynapsesConvergenceForPyramidalCellsData_2}
                        xAxisTitle="PSP Amplitude (mV)"
                        yAxisTitle="Count"
                    />
                    */}

                </Collapsible>

                <Collapsible id="physiologySection" title={`Physiology`}>
                    <p>We compared the model with experimental data in terms of postsynaptic potential (PSP) amplitude and time-course (rise time, tau decay, and half-width), and EPSP-IPSP latency.                    </p>

                    <h2 className="text-lg mt-8 mb-2">{PSPAmplitudeData.name}</h2>
                    <SCDistibutionGraph
                        data={PSPAmplitudeData}
                        xAxisTitle="PSP Amplitude (mV)"
                        yAxisTitle="Count"
                    />


                    <h2 className="text-lg mt-16 mb-2">{PSCRatioFromSCToCB1RPlusData.name}</h2>
                    <SCDistibutionGraph
                        data={PSCRatioFromSCToCB1RPlusData}
                        xAxisTitle="PSC Ratio"
                        yAxisTitle="Count"
                    />

                    <h2 className="text-lg mt-16 mb-2">{PSCRatioFromSCToCB1RMinusData.name}</h2>
                    <SCDistibutionGraph
                        data={PSCRatioFromSCToCB1RMinusData}
                        xAxisTitle="PSC Ratio"
                        yAxisTitle="Count"
                    />

                    <div className="w-full flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <h2 className="text-base mt-16 mb-2">{RiseTImeData.name}</h2>
                            <SCDistibutionGraph
                                data={RiseTImeData}
                                xAxisTitle="Rise Time (ms)"
                                yAxisTitle="Count"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-base mt-16 mb-2">{TauDecayData.name}</h2>
                            <SCDistibutionGraph
                                data={TauDecayData}
                                xAxisTitle="Tau Decay (ms)"
                                yAxisTitle="Count"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-base mt-16 mb-2">{HalfWidthData.name}</h2>
                            <SCDistibutionGraph
                                data={HalfWidthData}
                                xAxisTitle="Half-width (ms)"
                                yAxisTitle="Count"
                            />
                        </div>
                    </div>

                    <h2 className="text-lg mt-16 mb-2">{ESPS_IPSPLatencyData.name}</h2>
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
