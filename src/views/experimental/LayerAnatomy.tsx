import React from 'react';

import LayerAnatomyTemplate from '../../templates/LayerAnatomy';
import { colorName, sectionTitle } from './config';
import { layerAnatomyDataQuery } from '../../queries/es';
import Collapsible from '../../components/Collapsible';
import DataContainer from '../../components/DataContainer';
import ESData from '../../components/ESData';
import LayerThickness from '../../components/LayerThickness';
import NeuralDensity from '../../components/NeuralDensity';
import LayerAnatomySummary from '../../components/LayerAnatomySummary';


const LayerAnatomyView = () => (
  <LayerAnatomyTemplate
    color={colorName}
    sectionTitle={sectionTitle}
  >
    {(layer) => (
      <DataContainer visible={!!layer}>
        <ESData query={layerAnatomyDataQuery}>
          {data => (
            <>
              <Collapsible title="Summary">
                <>{data && <LayerAnatomySummary data={data}/>}</>
              </Collapsible>
              <Collapsible className="mt-4" title={`Layer ${layer}`}>
                {data && <LayerThickness layer={layer} data={data} />}
                {data && <NeuralDensity layer={layer} data={data} className="mt-3"/>}
              </Collapsible>
            </>
          )}
        </ESData>
      </DataContainer>
    )}
  </LayerAnatomyTemplate>
);

export default LayerAnatomyView;
