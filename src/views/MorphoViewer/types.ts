export type ColoringType = "section" | "distance";

export interface CellNode {
  /** Unique ID of this segment. */
  index: number;
  /** Index of the parent of this node. Can be `-1` if no parent is available. */
  parent: number;
  type: CellNodeType;
  x: number;
  y: number;
  z: number;
  radius: number;
  /** Used to set the distance to the soma, normalized between 0 and 1. */
  u: number;
  /** Type of segment (soma, axon, apical dendrite, ...) normalized between 0 and 1. */
  v: number;
}

export enum CellNodeType {
  Soma = 1,
  Axon = 2,
  BasalDendrite = 3,
  ApicalDendrite = 4,
  Unknown = 666,
}
