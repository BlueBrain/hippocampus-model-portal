import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import BoutonDensityValidation from './connection-anatomy/BoutonDensityValidation';
import ConnectionProbability from './connection-anatomy/ConnectionProbability';
import DivergenceValidation from './connection-anatomy/DivergenceValidation';

import ConvergenceValidation from './connection-anatomy/ConvergenceValidation';

import LaminarDistributionOfDynapses from './connection-anatomy/LaminarDistributionOfSynapses';
import NbOfSynapsesPConnection from './connection-anatomy/NbOfSynapsesPConnection';
import SynapticDivergencePercentages from './connection-anatomy/SynapticDivergencePercentages';

import { dataPath } from '@/config';

const ConnectionAnatomyView: React.FC = () => {

    const theme = 4;

    const [convergenceValidaton, setConvergenceValidaton] = useState(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/connection-anatomy/convergence-validation.json')
            .then((response) => response.json())
            .then((data) => setConvergenceValidaton(data));

    }, []);

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Connection Anatomy"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We validated the <Link className={`link theme-${theme}`} href={'#'}>connectome</Link>with a series of <Link className={`link theme-${theme}`} href={'#'}>experimental data</Link> not used to constrain it. These data include bouton density, number of synapses per connection, connection probability, convergence, and divergence.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>
            <DataContainer theme={theme}
                navItems={[
                    { id: 'BoutonDensityValidationSection', label: 'Bouton density validation' },
                    { id: 'ConnectionProbabilitySection', label: 'Connection probabilites validation' },
                    { id: 'ConvergenceValidationSection', label: 'Convergence validation' },
                    { id: 'DivergenceValidationSection', label: 'Divergence validation' },
                    { id: 'NbOfSynapsesPConnectionSection', label: 'Nb. of synapse p.connection validation' },
                    { id: 'SynapticDivergencePercentagesSection', label: 'Synaptic divergence percetages' },
                    { id: 'ModelLaminarDistributionOfDynapsesSection', label: 'Model laminar distribution of synapses' },
                ]}>

                <Collapsible id="BoutonDensityValidationSection" title={`Bouton density validation`}>
                    <BoutonDensityValidation theme={theme} />
                </Collapsible>

                <Collapsible id="ConnectionProbabilitySection" title={`Connection probabilites validation`}>
                    <ConnectionProbability theme={theme} />
                </Collapsible>

                <Collapsible id="ConvergenceValidationSection" title={`Convergence validation`}>

                    <div className="flex flex-col gap-8">
                        {convergenceValidaton && (
                            <ConvergenceValidation data={convergenceValidaton} theme={theme} />
                        )}
                    </div>

                </Collapsible>

                <Collapsible id="DivergenceValidationSection" title={`Divergence validation`}>
                    <DivergenceValidation theme={theme} />
                </Collapsible>

                <Collapsible id="NbOfSynapsesPConnectionSection" title={`Number of synapse per connection validation`}>
                    <NbOfSynapsesPConnection theme={theme} />
                </Collapsible>

                <Collapsible id="SynapticDivergencePercentagesSection" title={`Synaptic divergence percetages`}>
                    <SynapticDivergencePercentages theme={theme} />
                </Collapsible>


                <Collapsible id="ModelLaminarDistributionOfDynapsesSection" title={`Model laminar distribution of synapses`}>
                    <LaminarDistributionOfDynapses theme={theme} />
                </Collapsible>



            </DataContainer >
        </>
    );
};


export default ConnectionAnatomyView;
