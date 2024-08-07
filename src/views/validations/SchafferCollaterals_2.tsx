import React from 'react';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';


const SchafferCollateralsView: React.FC = () => {

    const theme = 4;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Schaffer Collaterals 2"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        After we validated the Schaffer collaterals at neuron and synapse level, we validated them at network level. In particular, we reproduced one of the experiments reported in Sasaki et al. (2006), where Schaffer collaterals are stimulated at different intensities with and without Gabazine (an antagonist of GABAA receptors). As in the experiment, the feedforward inhibition linearises the I-O response, while the I-O response saturates quickly when the inhibition is blocked. We repeated the simulations over three different slices.
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


export default SchafferCollateralsView;
