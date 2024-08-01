import React from 'react';
import Image from 'next/image';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import MinisTable from './minis/minis';

// Config Import
import { colorName } from './config';

const MinisView: React.FC = () => {
    const theme = 1;

    return (
        <>
            {/* Filters Section */}
            <Filters theme={theme}>
                <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
                    {/* Title and Info */}
                    <div className="w-full mb-12 md:mb-0">
                        <StickyContainer>
                            <Title
                                primaryColor={colorName}
                                title="Minis"
                                subtitle="Experimental Data"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        The spontaneous synaptic events are due to the spontaneous release of a vesicle
                                        (miniature events known as minis) or also due to a spontaneous action potential
                                        (spontaneous events). These events normally produce small voltage deflection of
                                        the membrane, but given the multitude of synaptic contacts in a network, their
                                        role in the network computation can be significant.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>

            {/* Data Container Section */}
            <DataContainer
                theme={theme}
                navItems={[
                    { id: 'minisSection', label: 'Minis' },
                ]}
            >
                <Collapsible
                    id="minisSection"
                    title="Minis"
                >
                    <p className="mb-4">
                        Single cell recordings with or without the neurotoxin tetrodotoxin (TTX),
                        which blocks the action potentials, allow the estimation of frequency and
                        amplitude of the spontaneous or miniature events in different pathways.
                    </p>

                    <MinisTable theme={theme} />
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default MinisView;