import React from "react";
import { Radio, RadioChangeEvent } from "antd";

import { classNames } from "@/utils";
import { SwcViewer, SwcViewerLoader } from "@/views/MorphoViewer/SwcViewer";
import { CellNodes } from "@/views/MorphoViewer/tools/nodes";
import { basePath } from "@/config";
import { CellNode, CellNodeType } from "@/views/MorphoViewer/types";
import { TgdVec3 } from "@/views/MorphoViewer/tgd";

import styles from "./pranav-viewer.module.css";

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

function Options(props: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  [
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
    { label: "Orange", value: "Orange", disabled: true },
  ];
  return (
    <Radio.Group
      options={props.options.map((id) => ({ label: id, value: id }))}
      onChange={({ target: { value } }: RadioChangeEvent) =>
        props.onChange(value)
      }
      value={props.value}
      optionType="button"
      buttonStyle="solid"
    />
  );
}

export function PranavViewer({ className, url }: PranavViewerProps) {
  const [type, setType] = React.useState("BPAP");
  const [field, setField] = React.useState("Amplitude");
  return (
    <div className={classNames(styles.main, className)}>
      <header>
        <Options options={["BPAP", "EPSP"]} value={type} onChange={setType} />
        <Options
          options={["Amplitude", "Delay"]}
          value={field}
          onChange={setField}
        />
      </header>
      <SwcViewer
        href={`${basePath}/${url}/${type.toLowerCase()}_result.csv`}
        loader={
          field === "Amplitude" ? pranavLoaderAmplitude : pranavLoaderDelay
        }
      />
    </div>
  );
}

async function pranavLoad(
  url: string,
  fields: string[],
  unit: string
): Promise<ReturnType<SwcViewerLoader>> {
  const resp = await fetch(url);
  if (!resp.ok) throw Error(`Error #${resp.status}: ${resp.statusText}`);

  const text = await resp.text();
  const [header, ...lines] = text
    .split("\n")
    .filter((line) => line.trim().length > 0);
  const get = makeGetter(header, fields);
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
      labelMin: `${minU.toFixed(3)} ${unit}`,
      labelMax: `${maxU.toFixed(3)} ${unit}`,
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
}

const pranavLoaderAmplitude: SwcViewerLoader = async (url: string) => {
  return pranavLoad(url, ["voltage_attenuation", "psp_amplitude_ratio"], "mV");
};

const pranavLoaderDelay: SwcViewerLoader = async (url: string) => {
  return pranavLoad(url, ["delay", "peak_delays"], "ms");
};

function makeGetter(header: string, voltages: string[]) {
  const fields = header.split(",").map((item) => item.trim().toLowerCase());
  const voltage = voltages.find((v) => fields.indexOf(v) > -1) ?? "";
  fields.indexOf("voltage_attenuation") > -1;
  if (voltages.includes("delay")) {
    console.log("🚀 [PranavViewer] voltage, header = ", voltage, header); // @FIXME: Remove this line written on 2024-10-24 at 08:26
  }
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
