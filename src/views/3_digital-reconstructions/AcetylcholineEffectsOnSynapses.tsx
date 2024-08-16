import React from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';


const AcetylcholineEffectOnSynapsesView: React.FC = () => {
  const theme = 3;

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Acetylcholine - Effects on Synapses"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We applied the <Link className={`link theme-${theme}`} href={'/reconstruction-data/acetylcholine/'}> dose - effect curves</Link> to predict the effect of acetylcholine on synapse short-term plasticity.
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


export default AcetylcholineEffectOnSynapsesView;
