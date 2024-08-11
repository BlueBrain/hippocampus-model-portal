import React from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import SynapseDensityProfileGraph from './schaffer-collaterals-1/anatomy/SynapsesDensityProfileGraph';
import DivergenceGraph from './schaffer-collaterals-1/anatomy/DivergenceGraph';
import NumberOfSynapsesPerConnectionGraph from './schaffer-collaterals-1/anatomy/NumberOfSynapsesPerConnectionGraph';
import SynapsesConvergenceForPyramidalCellsGraph from './schaffer-collaterals-1/anatomy/SynapseConvergenceForPyramidalCells';
import SynapsesConvergenceForPyramidalCellsGraph_2 from './schaffer-collaterals-1/anatomy/SynapseConvergenceForPyramidalCells_2';


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

                    <h2 className="text-lg mt-16">Synapse outdegree from each CA3 PC</h2>
                    <div className="mt-2"> <DivergenceGraph /></div>

                    <h2 className="text-lg mt-16">Number of synapse per connection</h2>
                    <div className="mt-2"> <NumberOfSynapsesPerConnectionGraph /></div>

                    <h2 className="text-lg mt-16">Synapse indegree on each CA1 PC"</h2>
                    <div className="mt-2"> <SynapsesConvergenceForPyramidalCellsGraph /></div>

                    <h2 className="text-lg mt-16">Synapse convergence for Pyramidal cells</h2>
                    <div className="mt-2"> <SynapsesConvergenceForPyramidalCellsGraph_2 /></div>
                </Collapsible>

                <Collapsible id="physiologySection" title={`Physiology`}>
                    <p>We compared the model with experimental data in terms of postsynaptic potential (PSP) amplitude and time-course (rise time, tau decay, and half-width), and EPSP-IPSP latency.                    </p>


                </Collapsible>

            </DataContainer >
        </>
    );
};


export default SchafferCollateralsView;
