import React from "react";

import { basePath } from "@/config";
import {
  TgdCameraOrthographic,
  TgdContext,
  TgdControllerCameraOrbit,
  tgdFullscreenToggle,
  TgdPainterClear,
  TgdPainterDepth,
  TgdPainterSegments,
} from "@tgd";

import styles from "./swc-viewer.module.css";
import { parseSwc } from "../tools/parser";
import { nodesToSegmentsData } from "../tools/nodes-to-segments";
import { GizmoCanvas } from "../gizmo";
import { interpolateCamera } from "../tools/interpolate-camera";
import { Scalebar } from "../Scalebar";
import { PixelScaleWatcher } from "../Scalebar/pixel-scale-watcher";

export interface SwcViewerProps {
  className?: string;
  href: string;
}

/**
 * Colors per section (soma, axon, dendrite, ...).
 */
const COLORS = ["#333", "#00f", "#f00", "#f0f", "#8a8"];

export function SwcViewer({ className, href }: SwcViewerProps) {
  const refWatcher = React.useRef(new PixelScaleWatcher());
  const refContainer = React.useRef<HTMLDivElement | null>(null);
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refGizmo = React.useRef(new GizmoCanvas());
  const refContext = React.useRef<TgdContext | null>(null);
  const [swcContent, setSwcContent] = React.useState<string | null>(null);
  React.useEffect(() => {
    const action = async () => {
      const resp = await fetch(`${basePath}/${href}`);
      const text = await resp.text();
      setSwcContent(text);
      const canvas = refCanvas.current;
      if (!canvas) return;

      let context = refContext.current;
      if (context) {
        context.removeAll();
      } else {
        const camera = new TgdCameraOrthographic({
          near: 1e-3,
          far: 1e6,
        });
        context = new TgdContext(canvas, { camera });
        refWatcher.current.context = context;
        const orbiter = new TgdControllerCameraOrbit(context, {
          minZoom: 0.1,
          maxZoom: 100,
          inertiaOrbit: 500,
          fixedTarget: true,
        });
        orbiter.enabled = true;
        const gizmo = refGizmo.current;
        gizmo.attachCamera(camera);
        gizmo.eventTipClick.addListener((journey) =>
          interpolateCamera(context as TgdContext, journey)
        );
        gizmo.eventOrbit.addListener(context.paint);
      }
      const nodes = parseSwc(text);
      const data = nodesToSegmentsData(nodes);
      context.camera.target = nodes.center;
      context.camera.spaceHeightAtTarget = nodes.bbox[1] * 2.5;
      console.log("🚀 [SwcViewer] data = ", data); // @FIXME: Remove this line written on 2024-10-08 at 10:09
      const painter = new TgdPainterSegments(context, data, {
        minRadius: 0.25,
      });
      painter.colorTexture.makePalette(COLORS);
      const painterOutline = new TgdPainterSegments(context, data, {
        minRadius: 0.25,
      });
      painterOutline.radiusMultiplier = 1.2;
      painterOutline.light = 0;
      painterOutline.shiftZ = 2;
      context.add(
        new TgdPainterClear(context, {
          color: [239 / 255, 241 / 255, 248 / 255, 1],
          depth: 1,
        }),
        new TgdPainterDepth(context, {
          enabled: true,
          func: "LESS",
          mask: true,
          rangeMin: 0,
          rangeMax: 1,
        }),
        painter,
        painterOutline
      );
      context.paint();
      refContext.current = context;
    };
    void action();
  }, [href]);
  const handleFullscreen = () => tgdFullscreenToggle(refContainer.current);

  return (
    <div
      className={styles.main}
      ref={refContainer}
      onDoubleClick={handleFullscreen}
    >
      <canvas ref={refCanvas}></canvas>
      <canvas
        className={styles.gizmo}
        ref={(canvas) => {
          refGizmo.current.canvas = canvas;
        }}
      ></canvas>
      <button onClick={handleFullscreen}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Toggle fullscreen</title>
          <path
            fill="currentColor"
            d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"
          />
        </svg>
      </button>
      <Scalebar
        className={styles.scalebar}
        pixelScaleWatcher={refWatcher.current}
      />
      <div className={styles.legend}>
        <div>
          <div>
            <div style={{ background: COLORS[0] }} />
            <div>Soma</div>
          </div>
          <div>
            <div style={{ background: COLORS[1] }} />
            <div>Axon</div>
          </div>
          <div>
            <div style={{ background: COLORS[2] }} />
            <div>Dendrites</div>
          </div>
        </div>
      </div>
    </div>
  );
}
