export type Palette = 'warm' | 'cool';

export type Direction = 'up' | 'down';

export type Layer = 'SLM' | 'SR' | 'SP' | 'SO';

export type VolumeSection = 'region' | 'slice' | 'cylinder';

export type NeuriteType = 'all' | 'axon' | 'apical' | 'basal' | 'dendrite' | 'soma';

export type CellGroup = 'All' | 'Excitatory' | 'Inhibitory' | 'SLM_PPA' | 'SO_BP' | 'SO_BS' | 'SO_OLM' | 'SO_Tri' | 'SP_AA' | 'SP_BS' | 'SP_CCKBC' | 'SP_Ivy' | 'SP_PC' | 'SP_PC' | 'SP_PVBC' | 'SR_SCA';

export type AchConcentration = '0um' | '10um' | '100um';

export type ThemeColors = {
  experimental_data: string;
  reconstruction_data: string;
  digital_reconstruction: string;
  validations: string;
  predictions: string;
};

export type GraphTheme = {
  red: string;
  blue: string;
  green: string;
  purple: string;
  yellow: string;
};


export type Color =
  | 'yellow'
  | 'blue'
  | 'blue-2'
  | 'lavender'
  | 'green'
  | 'grey'
  | 'orange'
  | 'grey-1'
  | 'grey-2'
  | 'grey-3'
  | 'grey-4'
  | 'grey-5';


type NexusSubject = {
  '@id': string;
  '@type': 'Subject';
  species: {
    '@id': string;
    label: string;
  };
};

type NexusContribution = {
  '@type': 'Contribution';
  agent: {
    '@id': string;
    '@type': string;
  };
  hadRole?: {
    '@id': string;
    label: string;
  };
};

type NexusAnnotation = {
  '@type': string[];
  hasBody: {
    '@id': string;
    '@type': string;
    label: string;
  };
  name?: string;
};

type NexusDerivation = {
  '@type': 'Derivation';
  entity: {
    '@id': string;
    '@type': string;
  };
};

type NexusDataDownload = {
  '@type': 'DataDownload';
  contentSize: {
    unitCode: string;
    value: number;
  };
  contentUrl: string;
  encodingFormat: string;
  name: string;
};

export type NexusMorphology = {
  '@id': string;
  '@type': string[];
  name: string;
  annotation: NexusAnnotation;
  brainLocation: {
    brainRegion: {
      '@id': string;
      label: string;
    };
  };
  contribution: NexusContribution | NexusContribution[];
  derivation: NexusDerivation | NexusDerivation[];
  distribution: NexusDataDownload | NexusDataDownload[];
  image: {
    '@id': string;
    '@type': 'Entity';
  };
  subject: NexusSubject;
  isRelatedTo?: {
    '@id': string;
    '@type': 'Trace';
  };
};

type NexusTraceImage = {
  '@id': string;
  about: 'nsg:ResponseTrace' | 'nsg:StimulationTrace';
  repetition: number;
  stimulusType: {
    '@id': string;
  };
}

export type NexusTrace = {
  '@id': string;
  '@type': string[];
  name: string;
  brainLocation: {
    '@type': 'BrainLocation';
    brainRegion: {
      '@id': string;
      label: string;
    }
  };
  annotation: NexusAnnotation;
  contribution: NexusContribution | NexusContribution[];
  distribution: NexusDataDownload | NexusDataDownload[];
  image: NexusTraceImage[];
  subject: NexusSubject;
  isRelatedTo?: {
    '@id': string;
    '@type': 'NeuronMorphology';
  };
};

export type QuickSelectorEntry = {
  title: string;
  key: string;
  values?: (string | number)[];
  getValuesFn?: (param: string) => string[] | number[];
  getValuesParam?: string;
  paramsToKeepOnChange?: string[];
  setFn?: (value: string | number) => void;
  sliderRange?: number[];
  formatFn?: (value: string | number) => string;
};


export type ThemeKeys = 1 | 2 | 3 | 4 | 5;

export interface ThemeEntry {
  default: number;
  hover: number;
  selected: number;
  selectedEdges: number;
}

export type Theme = Record<ThemeKeys, ThemeEntry>;