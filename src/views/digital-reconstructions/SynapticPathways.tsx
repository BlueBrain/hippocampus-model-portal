import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '../../layouts/Filters';
import StickyContainer from '../../components/StickyContainer';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import DataContainer from '../../components/DataContainer';
import Collapsible from '../../components/Collapsible';

import selectorStyle from '../../styles/selector.module.scss';


const SynapticPathwaysView: React.FC = () => {
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
                title="Synaptic Pathways"
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
                    src="https://fakeimg.pl/640x480/282828/faad14/?retina=1&text=PathwaySelect&font=bebas"
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

      <DataContainer>
        <Collapsible
          id="pathwaySection"
          title="Pathway <X>-<Y>"
        >
          <h3 className="text-tmp">Pathway factsheet</h3>
          <h3 className="text-tmp">Synaptic anatomy&physiology distribution plots</h3>
          <h3 className="text-tmp">Exemplar connection</h3>
          <div>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe src="https://bp.ocp.bbp.epfl.ch/viewer/rat-ca1-20211110-biom?gids=138484%2C68228"
                frameBorder="0"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
              />
            </div>
          </div>
        </Collapsible>

        <Collapsible
          id="synaptomesSection"
          title="Synaptomes"
          className="mt-4"
        >
          <h3 className="text-tmp">Text</h3>
          <h3 className="text-tmp">Pre-synaptic Synaptome plots + render</h3>
          <h3 className="text-tmp">Post-synaptic Synaptome plots + render</h3>
        </Collapsible>

        <Collapsible
          id="simulationsSection"
          title="Simulations"
          className="mt-4"
        >
          <h3 className="text-tmp">Text + images/videos? + links to the pair recording app</h3>
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default SynapticPathwaysView;