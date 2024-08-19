import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';

import SynDynamicsParamsTables from './connection-physiology/SynDynamicsParamsTables';

const SynapsesView: React.FC = () => {

  const theme = 2;

  return (
    <>
      <Filters theme={theme}>
        <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
          {/* Title and Info */}
          <div className="w-full mb-12 md:mb-0">
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Connection Physiology"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Starting from literature <Link href={"../experimental-data/connection-physiology/"} className={"link theme-" + theme}>data</Link> and pair recordings (<Link href="https://pubmed.ncbi.nlm.nih.gov/27038232/" className={"link theme-" + theme}>Kohus et al., 2016</Link>), we define a set of parameters and 22 rules to describe all possible pathways. We divide the parameters in two groups: presynaptic and postsynaptic.

                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
        </div>
      </Filters>


      <SynDynamicsParamsTables theme={theme} />


    </>
  );
};


export default SynapsesView;
