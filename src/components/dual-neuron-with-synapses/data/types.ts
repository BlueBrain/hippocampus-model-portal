export interface DualNeuronFile {
  pre: NeuronFile;
  post: NeuronFile;
  synapses: SynapseFile[];
}

export interface NeuronFile {
  etype: string;
  layer: string;
  me_combo: string;
  morph_class: string;
  morphology: string;
  mtype: string;
  region: string;
  synapse_class: string;
  x: number;
  y: number;
  z: number;
  orientation: [
    [x: number, y: number, z: number],
    [x: number, y: number, z: number],
    [x: number, y: number, z: number]
  ];
  morph: number[][];
}

export type SynapseFile = [
  x: number,
  y: number,
  z: number,
  type: number,
  preSectionId: number,
  postSectionId: number,
  preGID: number,
  postGID: number
];
