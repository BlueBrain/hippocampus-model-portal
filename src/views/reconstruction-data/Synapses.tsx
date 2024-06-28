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

import SynDynamicsParamsTables from './synapses/SynDynamicsParamsTables';

import selectorStyle from '@/styles/selector.module.scss';


const SynapsesView: React.FC = () => {

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
                title="Synapses"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Starting from literature <Link href={"../experimental-data/connection-physiology/"} className={"link theme-" + theme}>data</Link> and pair recordings (<Link href="https://pubmed.ncbi.nlm.nih.gov/27038232/" className={"link theme-" + theme}>Kohus et al., 2016</Link>), we define a set of parameters and 22 rules to describe all possible pathways. We divide the parameters in two groups: presynaptic and postsynaptic.

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
                  {/* 
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
        navItems={[]}
      >
        <Collapsible
          id="synapsesSection"
          title="Synapses"
        >
          <p className="text-tmp mb-3">
            Et quibusdam sunt et accusamus nihil aut officia alias vel galisum laudantium et consequatur adipisci ut
            sint quaerat? Aut mollitia excepturi id adipisci internos et aliquam repellat aut aperiam odit rem earum
            facere vel sequi consequatur ut soluta obcaecati. Non galisum accusantium ut iusto eius aut doloribus
            omnis eum quasi sint nam omnis aspernatur.
          </p>

          <SynDynamicsParamsTables />
        </Collapsible>

      </DataContainer>
    </>
  );
};


export default SynapsesView;
