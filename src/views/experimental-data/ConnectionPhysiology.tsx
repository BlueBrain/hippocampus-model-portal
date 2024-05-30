import React from 'react';
import { Row, Col, Table } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import ConductanceModelSection from './connection-physiology/ConductanceModelSection';
import AMPAKineticsSection from './connection-physiology/AMPAKineticsSection';
import NMDAKineticsSection from './connection-physiology/NMDAKineticsSection';

import selectorStyle from '@/styles/selector.module.scss';


const ConnectionPhysiologyView: React.FC = () => {
  const theme = 1;
  return (
    <>
      <Filters hasData={true}>
        <Row
          className="w-100"
          gutter={[0, 20]}
        >
          <Col
            className="mb-2"
            xs={24}
            lg={12}
          >
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Connection Physiology"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p >
                    Each synapse between pairs of pre and postsynaptic morphological types (m-types) shows unique properties in terms of strength and kinetics. We used data from literature to estimate the postsynaptic potential (PSP) and current (PSC), and the kinetics of the postsynaptic receptor (AMPA, NMDA, GABAA. GABAB is not considered).
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </Col>
          <Col
            className={`set-accent-color--${'grey'} mb-2`}
            xs={24}
            lg={12}
          >
            <div className={selectorStyle.selector} style={{ maxWidth: '26rem' }}>
              <div className={selectorStyle.selectorColumn}>
                {/* <div className={selectorStyle.selectorHead}></div> */}
                <div className={selectorStyle.selectorBody}>
                  <Image
                    src="https://fakeimg.pl/640x480/282828/faad14/?retina=1&text=Illustration&font=bebas"
                    width="640"
                    height="480"
                    unoptimized
                    alt=""
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer
        navItems={[
          { id: 'conductanceModelSection', label: 'Conductance Model' },
          { id: 'AMPAKineticsSection', label: 'PSC kinetics' },
          { id: 'NMDAKineticsSection', label: 'NMDA Kinetics' },
        ]}
      >
        <Collapsible
          id="conductanceModelSection"
          title="Conductance Model"
        >
          <ConductanceModelSection />
        </Collapsible>

        <Collapsible
          id="AMPAKineticsSection"
          className="mt-4"
          title="PSC kinetics"
        >
          <AMPAKineticsSection />
        </Collapsible>

        <Collapsible
          id="NMDAKineticsSection"
          className="mt-4"
          title="NMDA Kinetics"
        >
          <NMDAKineticsSection />
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default ConnectionPhysiologyView;
