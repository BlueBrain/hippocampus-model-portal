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

import selectorStyle from '@/styles/selector.module.scss';


const SchafferCollateralsView: React.FC = () => {
  return (
    <>
      <Filters hasData={true}>
        <Row
          className="w-100"
          gutter={[0,20]}
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
              />
              <div role="information">
                <InfoBox>
                  <p className="text-tmp">
                    Vivamus vel semper nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                    per inceptos himenaeos. Vivamus ipsum enim, fermentum quis ipsum nec, euismod convallis leo. <br/>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    Sed vel scelerisque felis, quis condimentum felis. Pellentesque dictum neque vel mauris dignissim,
                    vitae ornare arcu sagittis. <br/>
                    Etiam vestibulum, nisi in scelerisque porta, enim est gravida mi,
                    nec pulvinar enim ligula non lorem. Aliquam ut orci est.
                    Praesent tempus sollicitudin ante varius feugiat.
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

      <DataContainer
        navItems={[
          { id: 'tbd', label: 'TBD' },
        ]}
      >
        <Collapsible
          id="tbd"
          title="TBD"
        >
          <h3 className="text-tmp">TBD</h3>
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default SchafferCollateralsView;