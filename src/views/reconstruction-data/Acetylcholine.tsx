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

import NeuronsGraph from './acetylcholine/NeuronsGraph';

import selectorStyle from '@/styles/selector.module.scss';

const AcetylcholineView: React.FC = () => {

  const theme = 2;

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
                title="Acetylcholine"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Using data from <Link className={"link theme-" + theme} href={"/experimental-data/acetylcholine/"}>literature</Link>, we derive a dose-effect behavior of a tonic application of ACh on neurons and synapses.
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

      <DataContainer navItems={[
        { id: 'neuronsSection', label: 'Neurons' },
        { id: 'synapsesSection', label: 'Synapses' },
      ]}>

        <Collapsible id="neuronsSection" title="Neurons">
          <p>The net effect of ACh on CA1 neurons results in a depolarising current. The dose-effect relationship can be described with a Hill function.</p>
          <NeuronsGraph />
        </Collapsible>

        <Collapsible id="synapsesSection" title="Synapses">
          <p>The net effect of ACh on CA1 synapses results in an increase of the initial release probability (i.e. U parameter of TM synapse model). The dose-effect relationship can be described with a Hill function.</p>
        </Collapsible>

      </DataContainer>
    </>
  );
};

export default AcetylcholineView;