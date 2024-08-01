import React from 'react';
import Image from 'next/image';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';

import PhaseTable from './theta/Phase';
import RateTable from './theta/Rate';

// Config Import
import { colorName } from './config';

const ThetaView: React.FC = () => {
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
                primaryColor={colorName}
                title="Theta"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Extracellular electrical recordings of region CA1 display different types of
                    oscillatory activity related to behavioral states. One of the most prominent
                    and well-studied is the theta rhythm, a 4-12 Hz regular oscillation that occurs
                    during locomotion and rapid eye movement (REM) sleep. Theta rhythms are believed
                    to coordinate the encoding and retrieval of episodic memory during spatial
                    navigation. Here, we report on phases and rates of spiking during network theta
                    rhythmic activity.
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
          { id: 'phaseSection', label: 'Phase' },
          { id: 'rateSection', label: 'Rate' },
        ]}
      >
        <Collapsible
          id="phaseSection"
          className="mt-3"
          title="Phase"
        >
          <p>
            Different morphological types of CA1 neuron respond preferentially at
            specific phases of theta rhythmic activity.
          </p>
          <PhaseTable theme={theme} />
        </Collapsible>

        <Collapsible
          id="rateSection"
          className="mt-3"
          title="Rate"
        >
          <p>
            During periods of theta rhythmic activity, each morphological type of
            CA1 neuron tends to respond with a different average spiking rate.
          </p>
          <RateTable theme={theme} />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default ThetaView;