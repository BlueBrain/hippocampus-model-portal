import React from 'react';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

// Section Component Imports
import ConductanceModelSection from './connection-physiology/ConductanceModelSection';
import AMPAKineticsSection from './connection-physiology/AMPAKineticsSection';
import NMDAKineticsSection from './connection-physiology/NMDAKineticsSection';

// Config Import
import { colorName } from './config';

const ConnectionPhysiologyView: React.FC = () => {
  const theme = 1;

  return (
    <>
      {/* Filters Section */}
      <Filters theme={theme} hasData={true}>
        <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
          {/* Title and Info */}
          <div className="w-full mb-12 md:mb-0">
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
                    Each synapse between pairs of pre- and postsynaptic morphological types (m-types)
                    shows unique properties in terms of strength and kinetics. We used data from
                    literature to estimate the postsynaptic potential (PSP) and postsynaptic current (PSC),
                    and the kinetics of the postsynaptic receptor (i.e. AMPA, NMDA, GABAA. Please note
                    that GABAB was not included in our dataset).
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
          { id: 'conductanceModelSection', label: 'Conductance Model' },
          { id: 'AMPAKineticsSection', label: 'PSC kinetics' },
          { id: 'NMDAKineticsSection', label: 'NMDA Kinetics' },
        ]}
      >
        <Collapsible
          id="conductanceModelSection"
          title="Conductance Model"
        >
          <p className="mb-4">
            Basic characterization of a synaptic pathway includes the estimation of specific
            potentials and currents during synaptic activity. In particular, we collect data on
            the reversal potential of a synapse, the voltage at which there is no net flow of ions
            through the membrane, the peak PSP and PSC, and the coefficient of variation (CV) of the peak PSC.
          </p>
          <ConductanceModelSection />
        </Collapsible>

        <Collapsible
          id="AMPAKineticsSection"
          className="mt-4"
          title="PSC kinetics"
        >
          <p className="mb-4">
            PSC shows a specific rise and decay which depends on the synapse and the set of synaptic
            receptors. The rise time are usually measured as the time taken by the PSC trace to go
            from 10% to 90% of its amplitude, while the time constant of the decay (tau decay) is
            estimated fitting an exponential decay function (e-t/decay) after the PSC peak and
            identifying its time constant. When slow receptors (i.e. NMDA and GABAB) are inactive
            or blocked in the experiments, the measures are due to mainly the fast receptors,
            AMPA or GABAA, respectively for excitatory or inhibitory synapses.
          </p>
          <AMPAKineticsSection />
        </Collapsible>

        <Collapsible
          id="NMDAKineticsSection"
          className="mt-4"
          title="NMDA Kinetics"
        >
          <p className="mb-4">
            Excitatory synapses have two types of ionotropic receptors, AMPA and NMDA. Contribution
            of NMDA receptors to the synaptic response is expressed as a ratio between peak conductance
            of NMDA and AMPA (NMDA/AMPA ratio). NMDA has slower kinetics and rise and decay time
            constants are usually computed by fitting exponential rise (et/rise) and decay (e-t/decay) functions.
          </p>
          <NMDAKineticsSection />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default ConnectionPhysiologyView;