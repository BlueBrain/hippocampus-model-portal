import React from 'react';

import LayerAnatomyTemplate from '../../templates/LayerAnatomy';
import { colorName, sectionTitle } from './config';

const PredictionsNeuronsView = () => (
  <LayerAnatomyTemplate
    color={colorName}
    sectionTitle={sectionTitle}
  >
    {data => ''}
  </LayerAnatomyTemplate>
);

export default PredictionsNeuronsView;
