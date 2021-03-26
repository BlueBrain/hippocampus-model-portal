import React, { useContext } from 'react';
import { useRouter } from 'next/router';

import ServerSideContext from '../context/server-side-context';
import Filters from '../layouts/Filters';
import Title from '../components/Title';
import InfoBox from '../components/InfoBox';
import { lorem } from '../views/Styleguide';
import Selector from '../components/Selector';
import MicrocircuitSelector from '../components/MicrocircuitSelector';
import { Layer, Color } from '../types';
import Pills from '../components/Pills';
import { BrainRegion } from '../components/BrainRegionsSelector';
import { accentColors } from '../config';


export type MicrocircuitTemplateProps = {
  color: Color;
  sectionTitle: string;
  children?: (subregion: string, layerNums: number[]) => React.ReactNode;
};

const Microcircuit: React.FC<MicrocircuitTemplateProps> = ({
  color,
  sectionTitle,
  children,
}) => {
  const router = useRouter();
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext?.query, ...router?.query };

  const setQuery = (query: any) => {
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const currentRegion: BrainRegion = query.brain_region as BrainRegion;
  const currentLayer: Layer = query.layer as Layer;

  const setRegion = (region: BrainRegion) => {
    setQuery({
      layer: currentLayer,
      brain_region: region,
    });
  }
  const setLayer = (layer: Layer) => {
    setQuery({
      layer,
      brain_region: currentRegion,
    });
  }

  const layerNums = currentLayer
    ? currentLayer
      .replace('L', '')
      .split('')
      .map(numStr => parseInt(numStr))
    : [];

  return (
    <>
      <Filters
        primaryColor={color}
        backgroundAlt
        hasData={!!currentLayer && !!currentRegion}
      >
        <div className="center-col">
          <Title
            primaryColor={color}
            title="Microcircuit"
            subtitle={sectionTitle}
            hint="Select a microcircuit of interest."
          />
          <div>
            <InfoBox text="A neuronal microcircuit is the smallest functional ecosystem in any brain region that encompasses a diverse morphological and electrical assortment of neurons, and their synaptic interactions." />
            <br />
            <Pills
              title="1. Select a subregion"
              list={['S1DZ', 'S1DZO', 'S1FL', 'S1HL', 'S1J', 'S1Sh', 'S1Tr', 'S1ULp']}
              defaultValue={currentRegion}
              onSelect={setRegion as (s: string) => void}
              color={color}
            />
          </div>
        </div>
        <div className="center-col">
          <Selector title="2. Choose a layer" column>
            <MicrocircuitSelector
              color={accentColors[color]}
              defaultActiveLayer={currentLayer}
              onLayerSelected={setLayer}
              disabled={!currentRegion}
            />
          </Selector>
        </div>
      </Filters>

      {!!children && children(currentRegion, layerNums)}
    </>
  );
};

export default Microcircuit;
