export type Palette = 'warm' | 'cool';

export type Direction = 'up' | 'down';

export type Layer = 'SLM' | 'SR' | 'SP' | 'SO';

export type VolumeSection = 'region' | 'slice' | 'cylinder';

export type NeuriteType = 'all' | 'axon' | 'apical' | 'basal' | 'dendrite' | 'soma';

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
