import React, { useContext } from 'react';
import { useRouter } from 'next/router';

import ServerSideContext from '../context/server-side-context';
import LayerAnatomySelector from '../components/LayerAnatomySelector';
import Title from '../components/Title';
import InfoBox from '../components/InfoBox';
import Selector from '../components/Selector';
import Filters from '../layouts/Filters';
import { Layer, Color } from '../types';


export type LayerAnatomyTemplateProps = {
  color: Color;
  sectionTitle: string;
  children: (
    layer: Layer,
  ) => React.ReactNode;
};

const LayerAnatomy: React.FC<LayerAnatomyTemplateProps> = ({
  color,
  sectionTitle,
  children,
}) => {
  const router = useRouter();
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext?.query, ...router?.query };

  const setLayerQuery = (layer: Layer) => {
    router.push({ query: { layer }, pathname: router.pathname}, undefined, { shallow: true });
  };
  const currentLayer: Layer = query.layer as Layer;

  return (
    <>
      <Filters primaryColor={color} backgroundAlt hasData={!!currentLayer}>
        <div className="center-col">
          <Title
            primaryColor={color}
            title="Layer Anatomy"
            subtitle={sectionTitle}
            hint="The Somatosensory Cortex has a laminar structure <br> where neurons are organized across six distinct layers."
          />
          <div role="information">
            <InfoBox
              title="Layer thickness: S1"
              text="Data are provided in the form of raw microscopy images of NeuN (neuron-specific nuclear protein) stained coronal slices with annotations of individual layer extents, and spreadsheets summarizing measurements of layer thicknesses."
              color={color}
            />
          </div>
        </div>
        <div className="center-col">
          <Selector title="Choose a layer">
            <LayerAnatomySelector
              color={color}
              activeLayer={currentLayer}
              onLayerSelected={setLayerQuery}
            />
          </Selector>
        </div>
      </Filters>

      {children(currentLayer)}
    </>
  );
};

export default LayerAnatomy;
