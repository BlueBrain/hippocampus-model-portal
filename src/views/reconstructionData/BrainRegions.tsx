import React from 'react';

import BrainRegionTemplate from '../../templates/BrainRegions';
import { colorName, sectionTitle } from './config';

export default () => (
  <BrainRegionTemplate color={colorName} sectionTitle={sectionTitle} />
);
