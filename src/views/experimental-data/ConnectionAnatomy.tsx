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
import BoutonDenisityTable from './connection-anatomy/BoutonDensityTable';
import SynsPerConnTable from './connection-anatomy/SynsPerConnTable';

import selectorStyle from '@/styles/selector.module.scss';


const ConnectionAnatomyView: React.FC = () => {
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
                title="Connection Anatomy"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We collected and organized data on the local connectivity of pairs of pre- and postsynaptic morphological types (m-types). We used a subset of the data to constrain the connectome (the set of connections), namely bouton density and number of synapses per connection, and the rest to validate it.

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
          { id: 'boutonDensitySection', label: 'Bouton density' },
          { id: 'synNumPerConnectionSection', label: 'N syns/cons' },
        ]}
      >
        <Collapsible
          id="boutonDensitySection"
          title="Bouton density"
        >
          <h3 >Synaptic boutons or simply boutons are enlargements of the axon, visible with light microscopy, that represent putative synaptic contacts. Bouton density is normally expressed as the number of boutons per 100 um.
          </h3>
          <BoutonDenisityTable />
        </Collapsible>

        <Collapsible
          id="synNumPerConnectionSection"
          className="mt-4"
          title="Number of synapses per connection"
        >
          <h3 >Each connection between pairs of morphological types could include one or multiple synapses, which in part affects the strength of the connection.
          </h3>
          <SynsPerConnTable />
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default ConnectionAnatomyView;
