
import React from 'react';
import Image from 'next/image';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';


const VoltageView: React.FC = () => {

    const theme = 5;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Volate - Calcium Scan"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        Changing the extracellular ionic concentrations is known to alter excitability of neurons. To model this effect, we varied over a realistic range changes in extracellular calcium and the tonic depolarization resulting from varying extracellular potassium concentration. Here, we report that for restricted parameter ranges only variable and irregular theta activity was generated in CA1.
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


export default VoltageView;
