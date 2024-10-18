export interface DualNeuronData {
  pre: NeuronData;
  post: NeuronData;
  synapses: SynapseData[];
}

export interface NeuronData {
  etype: string;
  layer: string;
  meCombo: string;
  morphClass: string;
  morphology: string;
  mtype: string;
  region: string;
  synapseClass: string;
  x: number;
  y: number;
  z: number;
  orientation: [
    [x: number, y: number, z: number],
    [x: number, y: number, z: number],
    [x: number, y: number, z: number]
  ];
  morph: NeuronSectionData[];
}

export interface NeuronSectionData {
  sectionType: "soma" | "axon" | "dend";
  isBase: boolean;
  points: NeuronSectionPointData[];
}

export interface NeuronSectionPointData {
  x: number;
  y: number;
  z: number;
  r: number;
}

export type SynapseData = {
  x: number;
  y: number;
  z: number;
  type: number;
  preSectionId: number;
  postSectionId: number;
  preGID: number;
  postGID: number;
};
