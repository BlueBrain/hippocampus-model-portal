import React from "react";
import { classNames } from "@/utils";

import styles from "./pranav-viewer.module.css";
import { SwcViewer } from "@/views/MorphoViewer/SwcViewer";
import { CellNodes } from "@/views/MorphoViewer/tools/nodes";
import { basePath } from "@/config";
import { CellNode, CellNodeType } from "@/views/MorphoViewer/types";

export interface PranavViewerProps {
  className?: string;
  url: string;
}

export function PranavViewer({ className, url }: PranavViewerProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <SwcViewer
        href={`${basePath}/${url}/bpap_result.csv`}
        loader={pranavLoader}
      />
      <SwcViewer
        href={`${basePath}/${url}/epsp_result.csv`}
        loader={pranavLoader}
      />
    </div>
  );
}

async function pranavLoader(url: string): Promise<
  {
    nodes: CellNodes;
    colors: string[];
    minRadius?: number | undefined;
    roundness?: number | undefined;
  }[]
> {
  const resp = await fetch(url);
  if (!resp.ok) throw Error(`Error #${resp.status}: ${resp.statusText}`);

  const text = await resp.text();
  const [header, ...lines] = text
    .split("\n")
    .filter((line) => line.trim().length > 0);
  console.log("🚀 [PranavViewer] header = ", header); // @FIXME: Remove this line written on 2024-10-23 at 16:51
  console.log("🚀 [PranavViewer] lines = ", lines); // @FIXME: Remove this line written on 2024-10-23 at 16:51
  const get = makeGetter(header);
  const nodes: CellNode[] = lines.map((line) => {
    const fields = line.split(",");
    const node: CellNode = {
      type: CellNodeType.Unknown,
      index: get.id(fields),
      parent: get.parent(fields),
      x: get.x(fields),
      y: get.y(fields),
      z: get.z(fields),
      radius: get.radius(fields),
      u: get.u(fields),
      v: get.v(fields),
    };
    return node;
  });
  nodes.forEach((node, index) => {
    if (Number.isNaN(node.u)) {
      console.log("🚀 [PranavViewer] index, node = ", index, node); // @FIXME: Remove this line written on 2024-10-23 at 17:18
    }
  });
  const minU = nodes.reduce(
    (acc, node) => Math.min(acc, node.u),
    Number.MAX_VALUE
  );
  const maxU = nodes.reduce(
    (acc, node) => Math.max(acc, node.u),
    -Number.MAX_VALUE
  );
  const factor = 1 / (maxU - minU);
  nodes.forEach((node, index) => {
    nodes[index].u = factor * (node.u - minU);
    nodes[index].v = factor * (node.v - minU);
  });
  console.log("🚀 [PranavViewer] nodes = ", nodes); // @FIXME: Remove this line written on 2024-10-23 at 17:14
  return [
    {
      nodes: new CellNodes(nodes),
      colors: ["#07f", "#f70", "#f00"],
    },
  ];
}

function makeGetter(header: string) {
  const fields = header.split(",").map((item) => item.trim().toLowerCase());
  const voltage =
    fields.indexOf("voltage_attenuation") > -1
      ? "voltage_attenuation"
      : "psp_amplitude_ratio";

  return {
    id: makeFieldGetter(fields.indexOf("unique_int_id")),
    parent: makeFieldGetter(fields.indexOf("parent_unique_int_id")),
    x: makeFieldGetter(fields.indexOf("x")),
    y: makeFieldGetter(fields.indexOf("y")),
    z: makeFieldGetter(fields.indexOf("z")),
    radius: makeFieldGetter(fields.indexOf("radius")),
    u: makeFieldGetter(fields.indexOf("voltage_attenuation")),
    v: makeFieldGetter(fields.indexOf("voltage_attenuation")),
  };
}

function makeFieldGetter(index: number) {
  return (items: string[]) => parseFloat(items[index]);
}
