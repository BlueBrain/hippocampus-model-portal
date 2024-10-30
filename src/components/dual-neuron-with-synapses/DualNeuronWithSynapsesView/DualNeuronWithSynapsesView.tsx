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
  const combination = checkCombination(pre, post);
  if (!combination) {
    return (
      <div>
        No combination found for pre <b>{pre}</b> and post <b>{post}</b>!
      </div>
    );
  }

  return (
    <SwcViewer
      className={classNames(styles.main, className)}
      href={combination.href}
      loader={combination.reverse ? loadMsgPackReversed : loadMsgPack}
      legend={[
        { label: "Pre", color: "#07f" },
        { label: "Post", color: "#f70" },
        { label: "Synapse", color: "#ff0" },
      ]}
    />
  );
}

const loadMsgPackReversed: SwcViewerLoader = async (url: string) => {
  const data = await loadMsgPack(url);
  data.morphologies[0].colors = ["#333", "#a40", "#f70"];
  data.morphologies[1].colors = ["#333", "#04a", "#07f"];
  return data;
};

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

const MAP = {
  Excitatory: "SP_PC",
  Inhibitory: "SP_PVBC",
  All: "SLM_PPA",
};

/**
 * We don't have files for all the combinations of pre/post.
 * So we need to take something else.
 * @returns `null` if no file matches the combination pre/post.
 */
function checkCombination(
  pre: string,
  post: string
): { href: string; reverse: boolean } | null {
  pre = MAP[pre] ?? pre;
  post = MAP[post] ?? post;
  let reverse = false;
  const id = `${pre}/${post}`;
  if (!existingCombinations.has(id)) {
    const reversedId = `${post}/${pre}`;
    if (!existingCombinations.has(reversedId)) return null;

    const tmp = pre;
    pre = post;
    post = tmp;
    reverse = true;
  }

  return {
    reverse,
    href: `data/3d/3_digital-reconstruction/connection-viewer/${pre}-${post}.msgpack`,
  };
}

const existingCombinations = new Set<string>([
  "SLM_PPA/SO_OLM",
  "SLM_PPA/SO_Tri",
  "SLM_PPA/SP_CCKBC",
  "SLM_PPA/SR_SCA",
  "SO_BP/SLM_PPA",
  "SO_BP/SO_OLM",
  "SO_BP/SO_Tri",
  "SO_BP/SP_CCKBC",
  "SO_BP/SR_SCA",
  "SO_BS/SLM_PPA",
  "SO_BS/SO_BP",
  "SO_BS/SO_OLM",
  "SO_BS/SO_Tri",
  "SO_BS/SP_AA",
  "SO_BS/SP_BS",
  "SO_BS/SP_CCKBC",
  "SO_BS/SP_Ivy",
  "SO_BS/SP_PC",
  "SO_BS/SP_PVBC",
  "SO_BS/SR_SCA",
  "SO_OLM/SR_SCA",
  "SO_Tri/SO_OLM",
  "SO_Tri/SP_CCKBC",
  "SO_Tri/SR_SCA",
  "SP_AA/SP_PC",
  "SP_BS/SLM_PPA",
  "SP_BS/SO_BP",
  "SP_BS/SO_OLM",
  "SP_BS/SO_Tri",
  "SP_BS/SP_CCKBC",
  "SP_BS/SP_Ivy",
  "SP_BS/SR_SCA",
  "SP_CCKBC/SO_OLM",
  "SP_CCKBC/SR_SCA",
  "SP_Ivy/SLM_PPA",
  "SP_Ivy/SO_BP",
  "SP_Ivy/SO_OLM",
  "SP_Ivy/SO_Tri",
  "SP_Ivy/SP_CCKBC",
  "SP_Ivy/SR_SCA",
  "SP_PC/SLM_PPA",
  "SP_PC/SO_BP",
  "SP_PC/SO_OLM",
  "SP_PC/SO_Tri",
  "SP_PC/SP_BS",
  "SP_PC/SP_CCKBC",
  "SP_PC/SP_Ivy",
  "SP_PC/SP_PVBC",
  "SP_PC/SR_SCA",
  "SP_PVBC/SLM_PPA",
  "SP_PVBC/SO_BP",
  "SP_PVBC/SO_OLM",
  "SP_PVBC/SO_Tri",
  "SP_PVBC/SP_BS",
  "SP_PVBC/SP_CCKBC",
  "SP_PVBC/SP_Ivy",
  "SP_PVBC/SR_SCA",
]);
