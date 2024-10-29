import React from "react";

import { classNames } from "@/utils";
import { fetchDualNeuron } from "../data";
import { NeuronData, SynapseData } from "../types";

import styles from "./dual-neuron-with-synapses-view.module.css";
import { basePath } from "@/config";
import { SwcViewer, SwcViewerLoader } from "@/views/MorphoViewer/SwcViewer";
import { CellNodes } from "@/views/MorphoViewer/tools/nodes";
import { CellNode, CellNodeType } from "@/views/MorphoViewer/types";

export interface DualNeuronWithSynapsesViewProps {
  className?: string;
  pre: string;
  post: string;
}

export function DualNeuronWithSynapsesView({
  className,
  pre,
  post,
}: DualNeuronWithSynapsesViewProps) {
  return (
    <SwcViewer
      className={classNames(styles.main, className)}
      href={`data/3d/3_digital-reconstruction/connection-viewer/${pre}-${post}.msgpack`}
      loader={loadMsgPack}
      legend={[
        { label: "Pre", color: "#07f" },
        { label: "Post", color: "#f70" },
        { label: "Synapse", color: "#ff0" },
      ]}
    />
  );
}

const loadMsgPack: SwcViewerLoader = async (url: string) => {
  try {
    const data = await fetchDualNeuron(`${basePath}/${url}`);
    const nodesPre = convertDualNeuronIntoCellNodes(data.pre);
    const nodesPost = convertDualNeuronIntoCellNodes(data.post);
    const radius =
      Math.max(nodesPre.averageRadius, nodesPost.averageRadius) * 10;
    return {
      morphologies: [
        {
          colors: ["#333", "#04a", "#07f"],
          nodes: nodesPre,
        },
        {
          colors: ["#333", "#a40", "#f70"],
          nodes: nodesPost,
        },
        {
          colors: ["#ff0"],
          nodes: convertSynapsesIntoCellNodes(data.synapses, radius),
          minRadius: 8,
          roundness: 24,
        },
      ],
    };
  } catch (ex) {
    throw ex;
  }
};

function convertDualNeuronIntoCellNodes(data: NeuronData): CellNodes {
  const nodes: CellNode[] = [];
  const setUV = new Set<number>();
  for (const section of data.morph) {
    let parent = -1;
    for (let i = 0; i < section.points.length; i++) {
      const point = section.points[i];
      const index = nodes.length;
      const type = figureOutType(section.sectionType);
      const uv = (type - 0.5) / 3;
      setUV.add(uv);
      nodes.push({
        index,
        parent,
        type,
        radius: point.r,
        x: point.x,
        y: point.y,
        z: point.z,
        u: uv,
        v: uv,
      });
      parent = index;
    }
  }
  return new CellNodes(nodes);
}

function figureOutType(sectionType: string): CellNodeType {
  switch (sectionType) {
    case "soma":
      return CellNodeType.Soma;
    case "axon":
      return CellNodeType.Axon;
    case "dend":
      return CellNodeType.BasalDendrite;
    default:
      return CellNodeType.Unknown;
  }
}

function convertSynapsesIntoCellNodes(
  synapses: SynapseData[],
  radius: number
): CellNodes {
  const nodes: CellNode[] = [];
  for (const synapse of synapses) {
    const { x, y, z } = synapse;
    nodes.push({
      index: nodes.length,
      parent: -1,
      type: CellNodeType.Unknown,
      radius,
      x,
      y,
      z,
      u: 0,
      v: 0,
    });
    nodes.push({
      index: nodes.length,
      parent: nodes.length - 1,
      type: CellNodeType.Unknown,
      radius,
      x,
      y,
      z,
      u: 0,
      v: 0,
    });
  }
  return new CellNodes(nodes);
}
