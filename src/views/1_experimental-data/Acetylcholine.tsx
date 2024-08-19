import React from 'react';
import Image from 'next/image';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

// Table Component Imports
import RestingMembranePotentialTable from './acetylcholine/RestingMembranePotential';
import FiringRateTable from './acetylcholine/FiringRate';
import SynapsesTable from './acetylcholine/synapses';
import NetworkTable from './acetylcholine/network';

// Config Import
import { colorName } from './config';

const AcetylcholineView: React.FC = () => {
  const theme = 1;

  return (
    <>
      {/* Filters Section */}
      <Filters theme={theme}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Acetylcholine"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Acetylcholine (ACh) is one of the most studied neuromodulators, particularly
                    important for the hippocampus. Like other neuromodulators, its effect on the
                    network can span several time and space scales. Here, we report the effect of
                    ACh on resting membrane potential, firing rate, synaptic function, and network activity.
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
          { id: 'restingMembranePotentialSection', label: 'Resting membrane potential' },
          { id: 'firingRateSection', label: 'Firing rate' },
          { id: 'synapseSection', label: 'Synapse' },
          { id: 'networkSection', label: 'Network' }
        ]}
      >
        <Collapsible
          id="restingMembranePotentialSection"
          className="mt-4"
          title="Resting membrane potential"
        >
          <p className="mb-4">The data below shows that ACh tends to increase the resting membrane potential of CA1 neurons.</p>
          <RestingMembranePotentialTable theme={theme} />
        </Collapsible>

        <Collapsible
          id="firingRateSection"
          className="mt-4"
          title="Firing rate"
        >
          <p className="mb-4">The data below shows that ACh tends to increase the firing rates of CA1 neurons.</p>
          <FiringRateTable theme={theme} />
        </Collapsible>

        <Collapsible
          id="synapseSection"
          className="mt-4"
          title="Synapse"
        >
          <p className="mb-4">The data below shows that ACh tends to increase the postsynaptic response (potential or current) in CA1.</p>
          <SynapsesTable theme={theme} />
        </Collapsible>

        <Collapsible
          id="networkSection"
          className="mt-4"
          title="Network"
        >
          <p className="mb-4">Consistent with the effect on neurons and synapses, ACh tends to increase the network activity, which in turn induces oscillations.</p>
          <NetworkTable theme={theme} />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default AcetylcholineView;