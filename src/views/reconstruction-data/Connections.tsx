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

import SynsPerConnectionTable from './connections/synapsesPerConnection';

import selectorStyle from '@/styles/selector.module.scss';


const ConnectionsView: React.FC = () => {

  const theme = 2;

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
                title="Connections"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We used sparse data on <Link href={"/experimental-data/connection-anatomy/"} className={"link theme-" + theme}>connections</Link> to estimate properties of uncharacterized pathways.
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
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer navItems={[
        { id: 'nbSynapsesPerConnectionSection', label: 'Number of synapses per connection' },
        { id: 'boutonDensitySection', label: 'Bouton density' },
      ]}>

        <Collapsible id="nbSynapsesPerConnectionSection" title="Number of synapses per connection">
          <p>For <u>characterized pathways</u> we can use data from literature (see <Link href={"/experimental-data/connection-anatomy/"}> connection anatomy</Link>)</p>
          <p>For <u>uncharacterized pathways</u> we can use the following plot to extrapolate the ratio between appositions and synapses per connection.</p>

          <SynsPerConnectionTable />

          <p>For each pathway, the standard deviation is computed multiplying the mean and the coefficient of variation (CV) which is set to 0.5.</p>
        </Collapsible>

        <Collapsible id="boutonDensitySection" title="Bouton density">
          <p>For <u>characterized pathways</u> we can use data from literature (see <Link href={"/experimental-data/connection-anatomy/"}>connection anatomy</Link>)</p>
          <p>For <u>uncharacterized pathways</u> we can use the average of the values from the characterized pathways (0.2260 μm-1).</p>
        </Collapsible>

      </DataContainer>
    </>
  );
};


export default ConnectionsView;
