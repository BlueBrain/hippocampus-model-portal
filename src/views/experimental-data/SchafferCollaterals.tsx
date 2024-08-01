import React from 'react';
import Link from 'next/link';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

// Section Component Imports
import SCAnatomySection from './schaffer-collaterals/SCAnatomySection';
import SCSynapsePhysiologySection from './schaffer-collaterals/SCSynapsePhysiologySection';

// Config Import
import { colorName } from './config';

const SchafferCollateralsView: React.FC = () => {
  const theme = 1;

  return (
    <>
      {/* Filters Section */}
      <Filters theme={theme}>
        <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
          {/* Title and Info */}
          <div className="w-full mb-12 md:mb-0">
            <StickyContainer>
              <Title
                title="Schaffer Collaterals"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Schaffer collaterals are axons that arise from the CA3 pyramidal neurons
                    and create synapses onto the CA1 neurons. They represent the main input to the CA1.
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
          { id: 'anatomySection', label: 'Anatomy' },
          { id: 'synapsePhysiologySection', label: 'Synapse physiology' },
        ]}
      >
        <Collapsible
          id="anatomySection"
          title="Anatomy"
        >
          <p className="mb-4">
            Here we report the anatomical measurements on the connectivity established by
            Schaffer collaterals with excitatory (Exc) and inhibitory (Inh) neurons in CA1.
          </p>
          <SCAnatomySection />
        </Collapsible>

        <Collapsible
          id="synapsePhysiologySection"
          className="mt-3"
          title="Synapse physiology"
        >
          <p className="mb-4">
            Data about synapse physiology are divided into two main groups: one where we report
            data on connections between Schaffer collaterals and excitatory neurons (SC→Exc) and
            the other, between Schaffer collaterals and inhibitory neurons (SC→Inh). Similar to
            the connection <Link href="/experimental-data/connection-physiology/">physiology section</Link>,
            data consists of postsynaptic potentials and currents, and receptors properties.
            The dataset also includes the EPSP-IPSP latency, which is particularly important to
            reproduce the feedforward inhibition of the SC.
          </p>
          <SCSynapsePhysiologySection />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default SchafferCollateralsView;