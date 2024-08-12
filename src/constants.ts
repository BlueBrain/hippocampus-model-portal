import { Layer, NeuriteType, VolumeSection, CellGroup, Theme, GraphTheme } from './types';

export const layers: Layer[] = [
  'SLM',
  'SR',
  'SP',
  'SO',
];

export const theme: Theme = {
  1: { default: 0x44405B, hover: 0x7D656F, selected: 0xB68983, selectedEdges: 0xEFAE97 },
  2: { default: 0x44405B, hover: 0x7B5B6A, selected: 0xB37579, selectedEdges: 0xEA9088 },
  3: { default: 0x44405B, hover: 0x715970, selected: 0x9F7184, selectedEdges: 0xCC8A99 },
  4: { default: 0x44405B, hover: 0x625D77, selected: 0x807B92, selectedEdges: 0x9E98AE },
  5: { default: 0x44405B, hover: 0x595D79, selected: 0x6E7B97, selectedEdges: 0x8398B5 },
};

export const graphTheme: GraphTheme = {
  red: 'rgba(220, 20, 60, 1)',
  blue: 'rgba(65, 105, 225, 1)',
  green: 'rgba(34, 139, 34, 1)',
  purple: 'rgba(128, 0, 128, 1)',
  yellow: 'rgba(255, 165, 0, 1)',
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

export const cellGroup: CellGroup[] = [
  'All',
  'Excitatory',
  'Inhibitory',
  'SLM_PPA',
  'SO_BP',
  'SO_BS',
  'SO_OLM',
  'SO_Tri',
  'SP_AA',
  'SP_BS',
  'SP_CCKBC',
  'SP_Ivy',
  'SP_PC',
  'SP_PVBC',
  'SR_SCA'
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
      volume_section: 'slice',
      prelayer: 'All',
      postlayer: 'All',
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
