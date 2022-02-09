import { Layer } from './types';

export const layers: Layer[] = [
  'SLM',
  'SR',
  'SP',
  'SO',
];

export const defaultSelection = {
  experimentalData: {
    layerAnatomy: {
      layer: 'SLM',
    },
  },
};
