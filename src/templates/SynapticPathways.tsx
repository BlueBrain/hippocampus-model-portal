import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import ServerSideContext from '../context/server-side-context';
import Title from '../components/Title';
import InfoBox from '../components/InfoBox';
import { lorem } from '../views/Styleguide';
import Filters from '../layouts/Filters';
import Pills from '../components/Pills';
import { Layer, Color } from '../types';
import { BrainRegion } from '../components/BrainRegionsSelector';
import ComboSelector from '../components/ComboSelector';
import SynapticPathwaySelector from '../components/SynapticPathwaySelector';
import List from '../components/List';
import { accentColors } from '../config';
import { basePath } from '../config';


export type SynapticPathwaysTemplateProps = {
  color: Color;
  sectionTitle: string;
  children?: (subregion: string, pathway: string) => React.ReactNode;
};

type PathwayMType = {
  pre: {
    [layer: string]: string[];
  };
  post: {
    [layer: string]: string[];
  };
}

const SynapticPathways: React.FC<SynapticPathwaysTemplateProps> = ({
  sectionTitle,
  color,
  children,
}) => {
  const router = useRouter();
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext?.query, ...router?.query };

  const addParam = (key: string, value: string): void => {
    const query = {
      ...{
        brain_region: currentRegion,
        prelayer: currentPreLayer,
        postlayer: currentPostLayer,
        pretype: currentPreType,
        posttype: currentPostType,
      },
      [key]: value,
    };
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const [pathwayMType, setPathwayMType] = useState<PathwayMType | null>(null);

  const currentRegion: BrainRegion = query.brain_region as BrainRegion;
  const currentPreLayer: Layer = query.prelayer as Layer;
  const currentPostLayer: Layer = query.postlayer as Layer;
  const currentPreType: string = query.pretype as string;
  const currentPostType: string = query.posttype as string;

  const setRegion = (region: BrainRegion) => addParam('brain_region', region);
  const setPreLayerQuery = (layer: Layer) => addParam('prelayer', layer);
  const setPostLayerQuery = (layer: Layer) => addParam('postlayer', layer);
  const setPreTypeQuery = (layer: Layer) => addParam('pretype', layer);
  const setPostTypeQuery = (layer: Layer) => addParam('posttype', layer);

  const hasData = currentPreLayer && currentPostLayer && currentPreType && currentPostType;

  // FIXME: pick pathway mtypes from L2, L23 and L3 when user selects L23
  const preMTypes = pathwayMType && currentPreLayer
    ? pathwayMType.pre[currentPreLayer]
    : [];

  const postMTypes = pathwayMType && currentPostLayer
    ? pathwayMType.post[currentPostLayer]
    : [];

  const pathway = currentPreType && currentPostType
    ? `${currentPreType}-${currentPostType}`
    : null;

  useEffect(() => {
    fetch(`${basePath}/data/pathway-mtype.json`)
      .then(res => res.json())
      .then(pathwayMType => setPathwayMType(pathwayMType))
  }, []);

  return (
    <>
      <Filters primaryColor={color} hasData={!!hasData}>
        <div className="center-col">
          <Title
            primaryColor={color}
            title="Synaptic Pathways"
            subtitle={sectionTitle}
            hint="Select a subregion of interest in the S1 of the rat brain."
          />
          <div>
            <InfoBox
              color={color}
              text="A synaptic pathway encompasses the set of all possible connections between pairs of neurons of pre and postsynaptic  morphological types (m-types)."
            />
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
          <ComboSelector
            selector={
              <SynapticPathwaySelector
                color={accentColors[color]}
                defaultActivePreLayer={currentPreLayer}
                onPreLayerSelected={setPreLayerQuery}
                defaultActivePostLayer={currentPostLayer}
                onPostLayerSelected={setPostLayerQuery}
              />
            }
            list1={
              <List
                title="m-type pre-synaptic"
                list={preMTypes}
                value={currentPreType}
                onSelect={setPreTypeQuery as (s: string) => void}
                color={color}
              />
            }
            list2={
              <List
                title="m-type post-synaptic"
                list={postMTypes}
                value={currentPostType}
                onSelect={setPostTypeQuery as (s: string) => void}
                color="orange"
              />
            }
            selectorTitle="2. Choose two layers"
            listsTitle="3. Choose Pre and Post-synaptic"
            list1Open={!!currentPreLayer}
            list2Open={!!currentPostLayer}
          />
        </div>
      </Filters>

      {!!children && children(currentRegion, pathway as string)}
    </>
  );
};

export default SynapticPathways;
