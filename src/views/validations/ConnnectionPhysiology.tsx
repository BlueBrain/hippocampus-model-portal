import React from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import PSPGraph from './connection-physiology/PSPGraph';


const ConnectionPhysiologyView: React.FC = () => {

    const theme = 4;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Connection Physiology"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We validated the <Link className={`link theme-${theme}`} href={'/digital-reconstructions/synapses'}>synaptome</Link> with <Link className={`link theme-${theme}`} href={'#'}>data on post-synaptic potential (PSP) and coefficient of variation (CV) of the first PSP</Link>.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div >
            </Filters>
            <DataContainer theme={theme}
                navItems={[
                    { id: 'pspSection', label: 'PSP' },
                    { id: 'cvSection', label: 'CV' },
                ]}>

                <Collapsible id="anatomySection" title={`PSP`}>
                    <p>Post-synaptic potential (PSP) measured at the soma.
                    </p>
                    <PSPGraph theme={theme} />
                </Collapsible>

                <Collapsible id="physiologySection" title={`CV`}>
                    <p>PSP peaks can vary among several recordings due to the stochastic nature of the synaptic release. The coefficient of variation (CV) of the first PSP peak has been correlated with the number of vesicles in the release-ready pool (NRRP) (<Link className='link' href={"https://pubmed.ncbi.nlm.nih.gov/31680928/"}>Barros-Zulaica et al., 2019</Link>). </p>
                </Collapsible>
            </DataContainer >

        </>
    );
};


export default ConnectionPhysiologyView;
