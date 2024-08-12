import React from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import BAPValidationGraph from './neurons/BAPValidationGraph';
import PSPAttenuationGraph from './neurons/PSPAttenuationGraph';

const NeuronView: React.FC = () => {

    const theme = 4;

    return (
        <>




            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Neuron"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We validated <Link className={`link theme-${theme}`} href={'/digital-reconstructions/neurons'}>neuron models</Link> with experimental data on post-synaptic potential (PSP) (<Link className={`link theme-${theme}`} href={'https://pubmed.ncbi.nlm.nih.gov/10966620/'}>Magee and Cook, 2000</Link>) and back-propagating action potential (bAP) attenuation (<Link className={`link theme-${theme}`} href={'https://pubmed.ncbi.nlm.nih.gov/11731556/'}>Golding et al., 2001</Link>).
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>
            <DataContainer theme={theme}
                navItems={[
                    { id: 'bapSection', label: 'bAP' },
                    { id: 'pspSection', label: 'PSP' },
                ]}>

                <Collapsible id="bapSection" title={`bAP`}>
                    <p className='mb-4'>Action potentials generated at the soma or axon initial segment (AIS) travels backwards into the dendrites. The height of the AP is generally smaller at the level of the dendrites than at the level of the soma. The amount of decrement depends on the distance from the soma.</p>
                    <BAPValidationGraph theme={theme} />
                </Collapsible>


                <Collapsible id="pspSection" title={`PSP`}>
                    <p className='mb-4'>Post-synaptic potential (PSP) measured at the soma is generally smaller than the PSP measured at the level of the synapse. The amount of decrement depends on the distance from the soma. </p>
                    <PSPAttenuationGraph theme={theme} />
                </Collapsible>


            </DataContainer>

        </>
    );
};


export default NeuronView;
