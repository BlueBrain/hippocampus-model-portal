import { Layer, NeuriteType, VolumeSection, Theme } from './types';

export const layers: Layer[] = [
  'SLM',
  'SR',
  'SP',
  'SO',
];

export const theme: Theme = {
  1: { default: 0x44405B, hover: 0x745F6C, selected: 0xA37E7C, selectedEdges: 0xEFAE97 }, //ok
  2: { default: 0x44405B, hover: 0x745F6C, selected: 0x886C73, selectedEdges: 0xEFAE97 },
  3: { default: 0x413C5B, hover: 0x715970, selected: 0x8E677D, selectedEdges: 0xCC8A99 }, //ok
  4: { default: 0x44405B, hover: 0x745F6C, selected: 0x886C73, selectedEdges: 0xEFAE97 },
  5: { default: 0x44405B, hover: 0x745F6C, selected: 0x886C73, selectedEdges: 0xEFAE97 },
};


export const neuriteTypes: NeuriteType[] = [
  'axon',
  'apical',
  'basal',
  'dendrite',
  'soma',
  'all',
];

export const volumeSections: VolumeSection[] = [
  'region',
  'slice',
  'cylinder',
];

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
  reconstructionData: {
    volume: {
      volume_section: 'slice',
    },
    cellComposition: {
      volume_section: 'slice',
    },
  },
  digitalReconstruction: {
    region: {
      volume_section: 'slice',
    },
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
