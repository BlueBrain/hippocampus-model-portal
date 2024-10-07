import React from "react";

import { basePath } from "@/config";
import {
  TgdCameraOrthographic,
  TgdContext,
  TgdControllerCameraOrbit,
  TgdPainterClear,
  TgdPainterDepth,
  TgdPainterSegments,
} from "../tgd";

import styles from "./swc-viewer.module.css";
import { parseSwc } from "../tools/parser";
import { nodesToSegmentsData } from "../tools/nodes-to-segments";

export interface SwcViewerProps {
  className?: string;
  href: string;
}

export function SwcViewer({ className, href }: SwcViewerProps) {
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refContext = React.useRef<TgdContext | null>(null);
  const [swcContent, setSwcContent] = React.useState<string | null>(null);
  React.useEffect(() => {
    const action = async () => {
      const resp = await fetch(`${basePath}/${href}`);
      const text = await resp.text();
      setSwcContent(text);
      const canvas = refCanvas.current;
      if (!canvas) return;

      const nodes = parseSwc(text);
      const data = nodesToSegmentsData(nodes);
      const camera = new TgdCameraOrthographic({
        near: 1e-3,
        far: 1e6,
      });
      camera.target = nodes.center;
      camera.spaceHeightAtTarget = nodes.bbox[1];
      const context = new TgdContext(canvas, { camera });
      context.add(
        new TgdPainterClear(context, {
          color: [1, 1, 1, 1],
          depth: 1,
        }),
        new TgdPainterDepth(context, {
          enabled: true,
          func: "LEQUAL",
          mask: true,
          rangeMin: 0,
          rangeMax: 1,
        }),
        new TgdPainterSegments(context, data)
      );
      const orbiter = new TgdControllerCameraOrbit(context, {
        minZoom: 0.1,
        maxZoom: 100,
        inertiaOrbit: 500,
        fixedTarget: true,
      });
      context.paint();
    };
    void action();
  }, [href]);
  return (
    <div className={styles.main}>
      <canvas ref={refCanvas}></canvas>
    </div>
  );
}
