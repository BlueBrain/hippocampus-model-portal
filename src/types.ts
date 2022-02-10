export type Palette = 'warm' | 'cool';

export type Direction = 'up' | 'down';

export type Layer = 'SLM' | 'SR' | 'SP' | 'SO';

export type Color =
  | 'yellow'
  | 'blue'
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
  annotation: {
    name: string;
    hasBody: {
      label: string;
    };
  };
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
  contribution: NexusContribution | NexusContribution[];
  distribution: NexusDataDownload | NexusDataDownload[];
  image: NexusTraceImage[];
  subject: NexusSubject;
  isRelatedTo?: {
    '@id': string;
    '@type': 'NeuronMorphology';
  };
};
