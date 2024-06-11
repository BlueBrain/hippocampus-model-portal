import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import PhaseTable from './theta/Phase';
import RateTable from './theta/Rate';

import selectorStyle from '@/styles/selector.module.scss';


const ThetaView: React.FC = () => {

  const theme = 1;

  return (
    <>
      <Filters theme={theme}>
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
                title="Theta"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Extracellular electrical recordings of region CA1 display different types of oscillatory activity related to behavioral states. One of the most prominent and well-studied is the theta rhythm, a 4-12 Hz regular oscillation that occurs during locomotion and rapid eye movement (REM) sleep. Theta rhythms are believed to coordinate the encoding and retrieval of episodic memory during spatial navigation. Here, we report on phase and rate of spiking during network theta rhythmic activity.
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
          { id: 'phaseSection', label: 'Phase' },
          { id: 'rateSection', label: 'Rate' },
        ]}
      >
        <Collapsible
          id="phaseSection"
          className="mt-3"
          title="Phase"
        >
          <h3>
            Different morphological types of CA1 neuron respond preferentially at specific phases of theta rhythmic activity.
          </h3>
          <PhaseTable />
        </Collapsible>

        <Collapsible
          id="rateSection"
          className="mt-3"
          title="Rate"
        >
          <h3>
            During periods of theta rhythmic activity, each morphological type of CA1 neuron tends to respond with a different average spiking rate.
          </h3>
          <RateTable />
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default ThetaView;
