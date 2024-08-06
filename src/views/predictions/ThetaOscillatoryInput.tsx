
import React from 'react';
import Image from 'next/image';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import selectorStyle from '@/styles/selector.module.scss';


const ThetaOscillatoryInputView: React.FC = () => {

    const theme = 5;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Theta - Oscillatory input"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        To model the transmission of theta activity from CA3 to CA1, we generated individual random spike trains for each SC axon modulated by sinusoidal rate function (range 4-10 Hz). Here, we report how this induced a highly regular theta activity in CA1 that matched the stimulus frequency with homogeneous phase response of different morphological types. </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </Filters>
        </>
    );
};


export default ThetaOscillatoryInputView;
