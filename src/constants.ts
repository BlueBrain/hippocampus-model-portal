import { Layer, NeuriteType, VolumeSection, AchConcentration, CellGroup, Theme, GraphTheme, ThemeColors } from './types';
import AcetylcholineView from './views/4_validations/Acetylcholine';

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
  5: { default: 0x393D5E, hover: 0x595D79, selected: 0x6E7B97, selectedEdges: 0x8398B5 },
};

export const graphTheme: GraphTheme = {
  red: "#C46785",
  blue: "#3b4165",
  green: "#7FD982",
  purple: "#7F5482",
  yellow: "#f9f871",
};

export const themeColors: ThemeColors = {
  experimental_data: "#EFAE97",
  reconstruction_data: "#EA9088",
  digital_reconstruction: "#CC8A99",
  validations: "#9E98AE",
  predictions: "#8398B5",
};



export const neuriteTypes: NeuriteType[] = [
  'all',
  'axon',
  'apical',
  'basal',
  'dendrite',
  'soma',

];

export const volumeSections: VolumeSection[] = [
  'region',
  'slice',
  'cylinder',
];


export const achConcentrations: AchConcentration[] = [
  '0um',
  '10um',
  '100um'
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
      volume_section: 'region',
    },
    cellComposition: {
      volume_section: 'region',
    },
  },
  digitalReconstruction: {
    region: {
      volume_section: 'region',
    },
    morphologyLibrary: {
      mtype: 'SLM_PPA'
    },
    schafferCollateral: {
      volume_section: 'region',
      prelayer: 'all',
      postlayer: 'all'
    },
    connectionAnatomy: {
      volume_section: 'region',
      prelayer: 'all',
      postlayer: 'all'
    },
    connectionPhysiology: {
      volume_section: 'region',
      prelayer: 'all',
      postlayer: 'all'
    },
    acetylcholineEffectsOnSynapses: {
      ach_concentration: '0um',
      prelayer: 'all',
      postlayer: 'all'
    },
    neurons: {
      etype: 'SO_BP',
      mtype: 'cNAC',
    },
    synapticPathways: {
      volume_section: 'slice',
      prelayer: 'All',
      postlayer: 'All',
    },
    acetylcholine: {
      ach_concentration: '0um',
      prelayer: 'Excitatory',
      postlayer: 'Excitatory',
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
