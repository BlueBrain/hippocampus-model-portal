import React, { useContext } from 'react';
import { useRouter } from 'next/router';

import ServerSideContext from '../context/server-side-context';
import BrainRegionsSelector, { BrainRegion } from '../components/BrainRegionsSelector';
import Title from '../components/Title';
import InfoBox from '../components/InfoBox';
import Selector from '../components/Selector';
import Filters from '../layouts/Filters';
import { Color } from '../types';


export type BrainRegionTemplateProps = {
  color: Color;
  sectionTitle: string;
  children?: (subregion: string) => React.ReactNode;
};

const BrainRegions: React.FC<BrainRegionTemplateProps> = ({
  color,
  sectionTitle,
  children,
}) => {
  const router = useRouter();
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext?.query, ...router?.query };

  const setBrainRegionQuery = (brainRegion: BrainRegion) => {
    const query = {
      brain_region: brainRegion,
    };
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };
  const currentRegion = query.brain_region as BrainRegion;

  return (
    <>
      <Filters color={color} hasData={!!currentRegion}>
        <div className="center-col">
          <Title
            primaryColor={color}
            title="Brain Regions"
            subtitle={sectionTitle}
            hint="Select a subregion of interest in the S1 of the rat brain."
          />
          <div>
            <InfoBox
              text="We digitally reconstructed the non-barrel hind limb primary rat Somatosensory Cortex consisting of eight sub-regions, four million neurons mediated by four billion synapses."
              color={color}
            />
          </div>
        </div>
        <div className="center-col">
          <Selector title="Choose a subregion">
            <BrainRegionsSelector
              color={color}
              defaultActiveBrainRegion={currentRegion}
              onBrainRegionSelected={setBrainRegionQuery}
            />
          </Selector>
        </div>
      </Filters>

      {!!children && children(currentRegion)}
    </>
  );
};

export default BrainRegions;
