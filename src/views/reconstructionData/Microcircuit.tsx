import React from 'react';

import MicrocircuitsTemplates from '../../templates/Microcircuit';
import { colorName, sectionTitle } from './config';

export default () => (
  <MicrocircuitsTemplates color={colorName} sectionTitle={sectionTitle} />
);
