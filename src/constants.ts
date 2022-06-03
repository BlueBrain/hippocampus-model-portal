import { Layer, NeuriteType } from './types';

export const layers: Layer[] = [
  'SLM',
  'SR',
  'SP',
  'SO',
];

export const neuriteTypes: NeuriteType[] = [
  'all',
  'axon',
  'apical',
  'basal',
  'dendrite',
  'soma',
]

export const defaultSelection = {
  experimentalData: {
    layerAnatomy: {
      layer: 'SLM',
    },
    neuronMorphology: {
      layer: 'SLM',
      mtype: 'SLM_PPA',
      instance: '011127HP1',
    },
    neuronElectrophysiology: {
      etype: 'bAC',
      etype_instance: '95810035',
    },
  },
  digitalReconstruction: {
    neurons: {
      layer: 'SLM',
      etype: 'bAC',
      mtype: 'SLM_PPA',
      instance: 'CA1_int_bAC_011127HP1_20190329115610',
    },
    synapticPathways: {
      prelayer: 'SP',
      postlayer: 'SO',
      pretype: 'SP_PC',
      posttype: 'SO_BP',
    },
  },
};

export const neuriteColor: Record<NeuriteType, string> = {
  all: '#1fcf1f',
  axon: '#1111ff',
  apical: '#f442ad',
  basal: '#ff1111',
  dendrite: '#ff1111',
  soma: '#000',
};
