import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import SCAnatomySection from './schaffer-collaterals/SCAnatomySection';
import SCSynapsePhysiologySection from './schaffer-collaterals/SCSynapsePhysiologySection';

import selectorStyle from '@/styles/selector.module.scss';


const SchafferCollateralsView: React.FC = () => {
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
                title="Schaffer Collaterals"
                subtitle="Experimental Data"
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Schaffer collaterals are axons that arise from the CA3 pyramidal neurons and create synapses onto the CA1 neurons. They represent the main input to the CA1.
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
          { id: 'anatomySection', label: 'Anatomy' },
          { id: 'synapsePhysiologySection', label: 'Synapse physiology' },
        ]}
      >
        <Collapsible
          id="anatomySection"
          title="Anatomy"
        >
          <SCAnatomySection />
        </Collapsible>

        <Collapsible
          id="synapsePhysiologySection"
          className="mt-3"
          title="Synapse physiology"
        >
          <SCSynapsePhysiologySection />
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default SchafferCollateralsView;
