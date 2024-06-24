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
import ConnectionProbabilityTable from './connection-anatomy/ConnectionProbabilityTable';
import SDPerPrenapticTypeTable from './connection-anatomy/SDPerPrenapticTypeTable';
import PercentageSDOntoPyramidalCells from './connection-anatomy/PercentageSDOntoPyramidalCells';
import SynDivLayTable from './connection-anatomy/SynDivLay';

import selectorStyle from '@/styles/selector.module.scss';


const ConnectionAnatomyView: React.FC = () => {
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
          { id: 'boutonDensitySection', label: 'Bouton density' },
          { id: 'synNumPerConnectionSection', label: 'Syn./Conn.' },
          { id: 'connectionProbabilitySection', label: 'Conn. Probability' },
          { id: 'synapseDivergencePerTypeSection', label: 'Syn. Divergence' },
          { id: 'synapseDivergenceOntoPyramidalCellsSection', label: 'Syn. Divergence over E/I' },
          { id: 'synapseDivergencePerLayerSection', label: 'Syn. Divergence/layer' },
        ]}
      >
        <Collapsible
          id="boutonDensitySection"
          title="Bouton density"
        >
          <h3 >Synaptic boutons or simply boutons are enlargements of the axon, visible with light microscopy, that represent putative synaptic contacts. Bouton density is normally expressed as the number of boutons per 100 μm.
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

        <Collapsible
          id="connectionProbabilitySection"
          className="mt-4"
          title="Connection probability"
        >
          <h3>Connection probability
            Connection probability is the number of connected pairs among all the tested pairs. Available experimental data suffers from at least two important limitations. First, the data often come from slice experiments where a subset of connections may have been cut. Second, the method usually does not report precise distance of the pairs and this does not allow an accurate replica in the model.</h3>
          <ConnectionProbabilityTable />
        </Collapsible>

        <Collapsible
          id="synapseDivergencePerTypeSection"
          className="mt-4"
          title="Synapse divergence per presynaptic type"
        >
          <h3>Synapse divergence or outdegree is the number of synapses made by a presynaptic neuron or neuron type.</h3>
          <SDPerPrenapticTypeTable />
        </Collapsible>


        <Collapsible
          id="synapseDivergenceOntoPyramidalCellsSection"
          className="mt-4"
          title="Percentage of synapse divergence onto pyramidal cells and interneurons"
        >
          <h3>We can express the synapse divergence also in relation to the postsynaptic target. Here, we calculate the percentage of synapses made by a morphological type onto pyramidal cells or interneurons.</h3>
          <PercentageSDOntoPyramidalCells />
        </Collapsible>


        <Collapsible
          id="synapseDivergencePerLayerSection"
          className="mt-4"
          title="Percentage of synapse divergence per layer"
        >
          <h3>We present here the distribution of synapse divergence per morphological type across the different layers.</h3>
          <SynDivLayTable />
        </Collapsible>


      </DataContainer>
    </>
  );
};


export default ConnectionAnatomyView;
