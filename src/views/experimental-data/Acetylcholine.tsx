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



import RestingMembranePotentialTable from './acetylcholine/RestingMembranePotential';
import FiringRateTable from './acetylcholine/FiringRate';
import SynapsesTable from './acetylcholine/synapses';
import NetworkTable from './acetylcholine/network';


import selectorStyle from '@/styles/selector.module.scss';


const AcetylcholineView: React.FC = () => {
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
          { id: 'restingPembranePotentialSection', label: 'Resting membrane potential' },
          { id: 'firingRateSection', label: 'Firing rate' },
          { id: 'synapseSection', label: 'Synapse' },
          { id: 'networkSection', label: 'Network' }
        ]}
      >

        <Collapsible
          id="restingPembranePotentialSection"
          className="mt-4"
          title="Resting membrane potential"
        >
          <h3>The data below shows that ACh tends to increase the resting membrane potential of CA1 neurons.</h3>
          <RestingMembranePotentialTable />
        </Collapsible>

        <Collapsible
          id="firingRateSection"
          className="mt-4"
          title="Firing rate"
        >
          <h3>The data below shows that ACh tends to increase the firing rates of CA1 neurons.</h3>
          <FiringRateTable />
        </Collapsible>

        <Collapsible
          id="synapseSection"
          className="mt-4"
          title="Synapse"
        >
          <h3>The data below shows that ACh tends to increase the postsynaptic response (potential or current) in CA1.</h3>
          <SynapsesTable />
        </Collapsible>

        <Collapsible
          id="networkSection"
          className="mt-4"
          title="Network"
        >
          <h3>Consistent with the effect on neurons and synapses, ACh tends to increase the network activity, which in turn induces oscillations.</h3>
          <NetworkTable />
        </Collapsible>

      </DataContainer>
    </>
  );
};


export default AcetylcholineView;
