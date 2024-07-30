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

import selectorStyle from '@/styles/selector.module.scss';


const SchafferCollateralsView: React.FC = () => {

  const theme = 3;

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
                title="Schaffer collaterals"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Reconstruction of the Schaffer collaterals, the major input to the CA1. This massive innervation accounts for 9,122 M synapses, and most of the synapses considered in the model (92%).
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
                    src="https://fakeimg.pl/640x480/282828/faad14/?retina=1&text=Selector&font=bebas"
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

      <DataContainer theme={theme}
        navItems={[
          { id: 'anatomySection', label: 'Anatomy' },
          { id: 'physiologySection', label: 'Physiology' }
        ]}
      >
        <Collapsible id="anatomySection" title="Anatomy">
          <p>We used available <Link href={"/reconstruction-data/schaffer-collaterals"}>data</Link> to predict the anatomy of the SC. The connections between CA3 and CA1 can be analyzed in terms of number of synapses per connection, divergence, convergence, and connection probability.</p>
        </Collapsible>

        <Collapsible id="physiologySection" title="Physiology">
          <p>We used available <Link href={"/reconstruction-data/schaffer-collaterals"}>data</Link> to predict the physiology of the SC. The synapses between CA3 and CA1 can be analyzed in terms of PSP, latency, kinetics, NMDA/AMPA ratio, and short-term plasticity.</p>
        </Collapsible>

      </DataContainer >
    </>
  );
};


export default SchafferCollateralsView;
