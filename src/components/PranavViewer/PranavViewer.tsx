import React from "react";
import { classNames } from "@/utils";

import styles from "./pranav-viewer.module.css";
import { SwcViewer, SwcViewerLoader } from "@/views/MorphoViewer/SwcViewer";
import { CellNodes } from "@/views/MorphoViewer/tools/nodes";
import { basePath } from "@/config";
import { CellNode, CellNodeType } from "@/views/MorphoViewer/types";
import { TgdTexture2DOptions, TgdVec3 } from "@/views/MorphoViewer/tgd";

const COLORS = [
  "#004282",
  "#3d6099",
  "#238ec8",
  "#17b2dc",
  "#b0dcf1",
  "#26a065",
  "#99c68e",
  "#fecd70",
  "#e97c1d",
  "#dc1921",
];
export interface PranavViewerProps {
  className?: string;
  url: string;
}

export function PranavViewer({ className, url }: PranavViewerProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <h1>BPAP</h1>
      <SwcViewer
        href={`${basePath}/${url}/bpap_result.csv`}
        loader={pranavLoader}
      />
      <h1>EPSP</h1>
      <SwcViewer
        href={`${basePath}/${url}/epsp_result.csv`}
        loader={pranavLoader}
      />
    </div>
  );
}

const pranavLoader: SwcViewerLoader = async (url: string) => {
  const resp = await fetch(url);
  if (!resp.ok) throw Error(`Error #${resp.status}: ${resp.statusText}`);

  const text = await resp.text();
  const [header, ...lines] = text
    .split("\n")
    .filter((line) => line.trim().length > 0);
  console.log("🚀 [PranavViewer] header = ", header); // @FIXME: Remove this line written on 2024-10-23 at 16:51
  console.log("🚀 [PranavViewer] lines = ", lines); // @FIXME: Remove this line written on 2024-10-23 at 16:51
  const get = makeGetter(header);
  let centerCount = 0;
  let centerX = 0;
  let centerY = 0;
  let centerZ = 0;
  const nodes: CellNode[] = lines.map((line) => {
    const fields = line.split(",");
    const parent = get.parent(fields);
    const x = get.x(fields);
    const y = get.y(fields);
    const z = get.z(fields);
    if (parent < 1) {
      centerCount++;
      centerX += x;
      centerY += y;
      centerZ += z;
    }
    const node: CellNode = {
      type: CellNodeType.Unknown,
      index: get.id(fields),
      parent,
      x,
      y,
      z,
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
  const center =
    centerCount > 0
      ? new TgdVec3(centerX, centerY, centerZ).scale(1 / centerCount)
      : undefined;
  return {
    legend: {
      colorRamp: COLORS,
      labelMin: `${minU.toFixed(3)}`,
      labelMax: `${maxU.toFixed(3)}`,
    },
    morphologies: [
      {
        nodes: new CellNodes(nodes),
        colors: COLORS,
        texture: {
          magFilter: "LINEAR",
          minFilter: "LINEAR",
        },
        center,
      },
    ],
  };
};

function makeGetter(header: string) {
  const fields = header.split(",").map((item) => item.trim().toLowerCase());
  const voltage =
    fields.indexOf("voltage_attenuation") > -1
      ? "voltage_attenuation"
      : "psp_amplitude_ratio";
  console.log("🚀 [PranavViewer] voltage, header = ", voltage, header); // @FIXME: Remove this line written on 2024-10-24 at 08:26
  return {
    id: makeFieldGetter(fields.indexOf("unique_int_id")),
    parent: makeFieldGetter(fields.indexOf("parent_unique_int_id")),
    x: makeFieldGetter(fields.indexOf("x")),
    y: makeFieldGetter(fields.indexOf("y")),
    z: makeFieldGetter(fields.indexOf("z")),
    radius: makeFieldGetter(fields.indexOf("radius")),
    u: makeFieldGetter(fields.indexOf(voltage)),
    v: makeFieldGetter(fields.indexOf(voltage)),
  };
}

function makeFieldGetter(index: number) {
  return (items: string[]) => parseFloat(items[index]);
}
