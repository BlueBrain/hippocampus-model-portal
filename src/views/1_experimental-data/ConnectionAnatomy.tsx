import React from 'react';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

// Table Component Imports
import BoutonDensityTable from './connection-anatomy/BoutonDensityTable';
import SynsPerConnTable from './connection-anatomy/SynsPerConnTable';
import ConnectionProbabilityTable from './connection-anatomy/ConnectionProbabilityTable';
import SDPerPrenapticTypeTable from './connection-anatomy/SDPerPrenapticTypeTable';
import PercentageSDOntoPyramidalCells from './connection-anatomy/PercentageSDOntoPyramidalCells';
import SynDivLayTable from './connection-anatomy/SynDivLay';

// Config Import
import { colorName } from './config';

const ConnectionAnatomyView: React.FC = () => {
  const theme = 1;

  return (
    <>
      {/* Filters Section */}
      <Filters theme={theme} hasData={true}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
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
                    We collected and organized data on the local connectivity of pairs of pre- and
                    postsynaptic morphological types (m-types). We used a subset of the data to
                    constrain the connectome (the set of connections), namely bouton density and
                    number of synapses per connection, and the rest to validate it.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
        </div>
      </Filters>

      {/* Data Container Section */}
      <DataContainer
        theme={theme}
        navItems={[
          { id: 'boutonDensitySection', label: 'Bouton density' },
          { id: 'synNumPerConnectionSection', label: 'Syn./Conn.' },
          { id: 'connectionProbabilitySection', label: 'Conn. Probability' },
          { id: 'synapseDivergencePerTypeSection', label: 'Syn. Divergence' },
          { id: 'synapseDivergenceOntoPyramidalCellsSection', label: 'Syn. Divergence over E/I' },
          { id: 'synapseDivergencePerLayerSection', label: 'Syn. Divergence/layer' },
        ]}
      >
        <Collapsible id="boutonDensitySection" title="Bouton density">
          <p className="mb-4">
            Synaptic boutons, or simply, boutons, are enlargements of the axon, visible with light
            microscopy, that represent putative synaptic contacts. Bouton density is normally
            expressed as the number of boutons per 100 μm.
          </p>
          <BoutonDensityTable theme={theme} />
        </Collapsible>

        <Collapsible id="synNumPerConnectionSection" className="mt-4" title="Number of synapses per connection">
          <p className="mb-4">
            Each connection between pairs of morphological types could include one or multiple
            synapses, which in part affects the strength of the connection.
          </p>
          <SynsPerConnTable theme={theme} />
        </Collapsible>

        <Collapsible id="connectionProbabilitySection" className="mt-4" title="Connection probability">
          <p className="mb-4">
            Connection probability is the number of connected pairs among all the tested pairs.
            Available experimental data suffers from at least two important limitations. First,
            the data often come from slice experiments where a subset of connections may have been cut.
            Second, the method usually does not report precise distance of the pairs and this does
            not allow an accurate replica in the model.
          </p>
          <ConnectionProbabilityTable theme={theme} />
        </Collapsible>

        <Collapsible id="synapseDivergencePerTypeSection" className="mt-4" title="Synapse divergence per presynaptic type">
          <p className="mb-4">
            We can express the synapse divergence also in relation to the postsynaptic target.
            Here, we calculate the percentage of synapses made by a morphological type onto
            pyramidal cells or interneurons.
          </p>
          <SDPerPrenapticTypeTable theme={theme} />
        </Collapsible>

        <Collapsible id="synapseDivergenceOntoPyramidalCellsSection" className="mt-4" title="Percentage of synapse divergence onto pyramidal cells and interneurons">
          <p className="mb-4">
            We can express the synapse divergence also in relation to the postsynaptic target.
            Here, we calculate the percentage of synapses made by a morphological type onto
            pyramidal cells or interneurons.
          </p>
          <PercentageSDOntoPyramidalCells theme={theme} />
        </Collapsible>

        <Collapsible id="synapseDivergencePerLayerSection" className="mt-4" title="Percentage of synapse divergence per layer">
          <p className="mb-4">
            We present here the distribution of synapse divergence per morphological type across
            the different layers.
          </p>
          <SynDivLayTable theme={theme} />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default ConnectionAnatomyView;