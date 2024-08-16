import React from 'react';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';

const SpontaneousActivityView: React.FC = () => {

    const theme = 5;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Spontaneous Activity"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We simulated the network using different levels of spontaneous synaptic release (0.00025 - 0.002 Hz) and different extracellular calcium concentration (1 - 2 mM). These simulations can give a prediction on how the CA1 could behave without any external inputs at in vivo or in vitro extracellular calcium concentrations (respectively 1 and 2 mM). In these conditions, the activity is very sparse and irregular.
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


export default SpontaneousActivityView;
