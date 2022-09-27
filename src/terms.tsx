import React from 'react';

export type TermDescription = Record<string, string>;


export const layerDescription: TermDescription = {
  SLM: 'Stratum Lacunosum-Moleculare',
  SR: 'Stratum Radiatum',
  SP: 'Stratum Pyramidal',
  SO: 'Stratum Oriens',
};

export const mtypeDescription: TermDescription = {
  PPA: 'Perforant Pathway Associated Cell',
  SCA: 'Schaffer Collateral Associated Cell',
  AA: 'Axon Axonic Cell',
  BS: 'Bistratified Cell',
  PVBC: 'PV+ Basket Cell',
  CCKBC: 'CCK+ Basket Cell',
  PC: 'Pyramidal Cell',
  BP: 'Back-Projecting Cell',
  OLM: 'Oriens Lacunosum-Moleculare Cell',
  Tri: 'Trilaminar Cell',
  Ivy: 'Ivy Cell',
};

export const stypeDescription: TermDescription = {
  E1: 'Excitatory facilitating',
  E2: 'Excitatory depressing',
  I1: 'Inhibitory facilitating',
  I2: 'Inhibitory depressing',
  I3: 'Inhibitory pseudo linear',
};

export const etypeDescription: TermDescription = {
  cADpyr: 'continuous Accommodating (Adapting) for pyramidal cells',
  cAC: 'continuous Accommodating',
  bAC: 'burst Accommodating',
  cNAC: 'continuous Non-accommodating',
  bNAC: 'burst Non-accommodating',
  dNAC: 'delayed Non-accommodating',
  cSTUT: 'continuous Stuttering',
  bSTUT: 'burst Stuttering',
  dSTUT: 'delayed Stuttering',
  cIR: 'continuous Irregular',
  bIR: 'burst Irregular',
};

export const pathwayDescription: TermDescription = {
  gsyn: 'The peak conductance (in nS) for a single synaptic contact',
  U: 'Utilization of synaptic efficacy - analogous to the transmitter release probability at a single synaptic contact',
  D: 'Time constant (in ms) for recovery from depression',
  F: 'Time constant (in ms) for recovery from facilitation',
};

export const formattedTerm: Record<string, React.ReactNode> = {
  gsyn: (<span>g<sub>syn</sub></span>),
};
