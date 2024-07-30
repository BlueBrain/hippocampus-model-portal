import React from 'react';
import { Row, Col, Table } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import ConductanceModelSection from './connection-physiology/ConductanceModelSection';
import AMPAKineticsSection from './connection-physiology/AMPAKineticsSection';
import NMDAKineticsSection from './connection-physiology/NMDAKineticsSection';

import selectorStyle from '@/styles/selector.module.scss';


const ConnectionPhysiologyView: React.FC = () => {
  const theme = 1;
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
                title="Connection Physiology"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Each synapse between pairs of pre- and postsynaptic morphological types (m-types) shows unique properties in terms of strength and kinetics. We used data from literature to estimate the postsynaptic potential (PSP) and postsynaptic current (PSC), and the kinetics of the postsynaptic receptor (i.e. AMPA, NMDA, GABAA. Please note that GABAB was not included in our dataset).
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

      <DataContainer theme={theme}
        navItems={[
          { id: 'conductanceModelSection', label: 'Conductance Model' },
          { id: 'AMPAKineticsSection', label: 'PSC kinetics' },
          { id: 'NMDAKineticsSection', label: 'NMDA Kinetics' },
        ]}
      >
        <Collapsible
          id="conductanceModelSection"
          title="Conductance Model"
        >
          <p>
            Basic characterization of a synaptic pathway includes the estimation of specific potentials and currents during synaptic activity. In particular, we collect data on the reversal potential of a synapse, the voltage at which there is no net flow of ions through the membrane, the peak PSP and PSC, and the coefficient of variation (CV) of the peak PSC.
          </p>
          <ConductanceModelSection />
        </Collapsible>

        <Collapsible
          id="AMPAKineticsSection"
          className="mt-4"
          title="PSC kinetics"
        >
          <p>
            PSC shows a specific rise and decay which depends on the synapse and the set of synaptic receptors. The rise time are usually measured as the time taken by the PSC trace to go from 10% to 90% of its amplitude, while the time constant of the decay (tau decay) is estimated fitting an exponential decay function (e-t/decay) after the PSC peak and identifying its time constant. When slow receptors (i.e. NMDA and GABAB) are inactive or blocked in the experiments, the measures are due to mainly the fast receptors, AMPA or GABAA, respectively for excitatory or inhibitory synapses.
          </p>
          <AMPAKineticsSection />
        </Collapsible>

        <Collapsible
          id="NMDAKineticsSection"
          className="mt-4"
          title="NMDA Kinetics"
        >
          <p className="mb-3">
            Excitatory synapses have two types of ionotropic receptors, AMPA and NMDA. Contribution of NMDA receptors to the synaptic response is expressed as a ratio between peak conductance of NMDA and AMPA (NMDA/AMPA ratio). NMDA has slower kinetics and rise and decay time constants are usually computed by fitting exponential rise (et/rise) and decay (e-t/decay) functions.
          </p>
          <NMDAKineticsSection />
        </Collapsible>
      </DataContainer >
    </>
  );
};


export default ConnectionPhysiologyView;
