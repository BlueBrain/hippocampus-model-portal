import { decode } from "@msgpack/msgpack";

import {
  DualNeuronData,
  NeuronData,
  NeuronSectionData,
  NeuronSectionPointData,
  SynapseData,
} from "../types";
import { DualNeuronFile, NeuronFile, SynapseFile } from "./types";
import { assertType, TypeDef } from "./guards";

export async function fetchDualNeuron(url: string): Promise<DualNeuronData> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw Error(
      `Unable to load from "${url}": error #${resp.status} ${resp.statusText}`
    );
  }

  const buff = await resp.arrayBuffer();
  const file = decode(buff);
  assertDualNeuronFile(file);
  return {
    pre: convertToNeuronData(file.pre),
    post: convertToNeuronData(file.post),
    synapses: file.synapses.map(convertToSynapseData),
  };
}

function assertDualNeuronFile(file: unknown): asserts file is DualNeuronFile {
  const typeNeuron: TypeDef = {
    etype: "string",
    layer: "string",
    me_combo: "string",
    morph_class: "string",
    morphology: "string",
    mtype: "string",
    region: "string",
    synapse_class: "string",
    x: "number",
    y: "number",
    z: "number",
    orientation: ["array(3)", ["array(3)", "number"]],
    morph: ["array", ["array", "number"]],
  };
  assertType(file, {
    pre: typeNeuron,
    post: typeNeuron,
    synapses: ["array", ["array", "number"]],
  });
}

function convertToNeuronData(file: NeuronFile): NeuronData {
  return {
    etype: file.etype,
    layer: file.layer,
    meCombo: file.me_combo,
    morphClass: file.morph_class,
    morphology: file.morphology,
    mtype: file.mtype,
    region: file.region,
    synapseClass: file.synapse_class,
    x: file.x,
    y: file.y,
    z: file.z,
    orientation: structuredClone(file.orientation),
    morph: file.morph.map(convertToNeuronSectionData),
  };
}

function convertToSynapseData(file: SynapseFile): SynapseData {
  const [x, y, z, type, preSectionId, postSectionId, preGID, postGID] = file;
  return {
    x,
    y,
    z,
    type,
    preSectionId,
    postSectionId,
    preGID,
    postGID,
  };
}

const SECTION_TYPES = ["soma", "axon", "dend"];

function convertToNeuronSectionData(file: number[]): NeuronSectionData {
  const [sectionType, isBase, ...rest] = file;
  const points: NeuronSectionPointData[] = [];
  for (let i = 0; i < rest.length; i += 4) {
    points.push({
      x: rest[i + 0],
      y: rest[i + 1],
      z: rest[i + 2],
      r: rest[i + 3] / 2, // Convert diameter into radius.
    });
  }
  return {
    sectionType: (SECTION_TYPES[sectionType] ?? "dend") as
      | "soma"
      | "axon"
      | "dend",
    isBase: isBase !== 0,
    points,
  };
}
