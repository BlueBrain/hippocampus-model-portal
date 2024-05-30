import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';

import selectorStyle from '@/styles/selector.module.scss';


const AcetylcholineView: React.FC = () => {
  const theme = 1;

  return (
    <>
      <Filters>
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
                title="Acetylcholine"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p >
                    Acetylcholine (ACh) is one of the most studied neuromodulation, particularly important for the hippocampus. Similarly to the other neuromodulators, its effect on the network can span several time and space scales. Here, we report the effect of ACh on resting membrane potential, firing rate, synapse, and network.
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
    </>
  );
};


export default AcetylcholineView;
