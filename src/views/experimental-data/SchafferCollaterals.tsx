import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

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

  const theme = 1;

  return (
    <>
      <Filters theme={theme} hasData={true}>
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
                theme={theme}
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
                  {/*}
                  <Image
                    src="https://fakeimg.pl/640x480/282828/faad14/?retina=1&text=Illustration&font=bebas"
                    width="640"
                    height="480"
                    unoptimized
                    alt=""
                  />
  */}
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
          <p>
            Here we report the anatomical measurements on the connectivity established by Schaffer collaterals with excitatory (Exc) and inhibitory (Inh) neurons in CA1.
          </p>
          <SCAnatomySection />
        </Collapsible>

        <Collapsible
          id="synapsePhysiologySection"
          className="mt-3"
          title="Synapse physiology"
        >
          <p>
            Data about synapse physiology are divided into two main groups: one where we report data on connections between Schaffer collaterals and excitatory neurons (SC→Exc) and the other, between Schaffer collaterals and inhibitory neurons  (SC→Inh). Similar to the connection <Link href={"/experimental-data/connection-physiology/"}>physiology section</Link> , data consists of postsynaptic potentials and currents, and receptors properties. The dataset also includes the EPSP-IPSP latency, which is particularly important to reproduce the feedforward inhibition of the SC.
          </p>
          <SCSynapsePhysiologySection />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default SchafferCollateralsView;
