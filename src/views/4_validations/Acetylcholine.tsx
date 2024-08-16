import React from 'react';
import Link from 'next/link';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import selectorStyle from '@/styles/selector.module.scss';


const AcetylcholineView: React.FC = () => {

    const theme = 4;

    return (
        <>
            <Filters theme={theme} hasData={true}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Acetylcholine"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We validated the impact of acetylcholine at network level using <Link className={`link theme-${theme}`} href={'/experimental-data/acetylcholine/'}>available data from literature</Link>. As in the experiments, we observe different network dynamics depending on the concentration of acetylcholine.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                </div >
            </Filters >
        </>
    );
};


export default AcetylcholineView;
