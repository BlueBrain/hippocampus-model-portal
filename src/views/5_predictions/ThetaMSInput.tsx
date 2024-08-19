import React from 'react';
import Image from 'next/image';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import selectorStyle from '@/styles/selector.module.scss';


const ThetaMSInputView: React.FC = () => {

    const theme = 5;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Theta - MS input"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        In the absence of medial septum (MS) region, we imitated its effect through a tonic depolarisation to represent in vivo background activity and an additional depolarisation corresponding arhythmic ACh release applied to all neurons and theta-range oscillatory hyperpolarizing current applied to PV+ interneurons only. The latter models the rhythmic disinhibition of CA1 observed in vivo. Here, we report how this induced regular theta activity in CA1 with heterogeneous phase response of different morphological types.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>

        </>
    );
};


export default ThetaMSInputView;
