import React from 'react';

import LayerAnatomyTemplate from '../../templates/LayerAnatomy';
import { colorName, sectionTitle } from './config';

const ValidationsNeuronsView = () => (
  <LayerAnatomyTemplate
    color={colorName}
    sectionTitle={sectionTitle}
  >
    {data => ''}
  </LayerAnatomyTemplate>
);

export default ValidationsNeuronsView;
