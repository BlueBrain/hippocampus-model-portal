import React from 'react';

import NeuronTemplate from '../../templates/Neuron';
import { colorName, sectionTitle } from './config';
import Collapsible from '../../components/Collapsible';


const pathwayFactsheetPath = () => '';

const NeuronsView = () => (
  <NeuronTemplate
    color={colorName}
    sectionTitle={sectionTitle}
    factsheetPath={pathwayFactsheetPath}
  >
    {(data, title) => (
      <>
        <Collapsible title={title}>
          <span>test</span>
        </Collapsible>
      </>
    )}
  </NeuronTemplate>
);

export default NeuronsView;
