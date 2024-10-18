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
  TgdVec3,
} from "@tgd";

import styles from "./swc-viewer.module.css";
import { parseSwc } from "../tools/parser";
import { nodesToSegmentsData } from "../tools/nodes-to-segments";
import { GizmoCanvas } from "../gizmo";
import { interpolateCamera } from "../tools/interpolate-camera";
import { Scalebar } from "../Scalebar";
import { PixelScaleWatcher } from "../Scalebar/pixel-scale-watcher";
import { CellNodes } from "../tools/nodes";

export interface SwcViewerProps {
  className?: string;
  href: string;
  loader?(href: string): Promise<
    Array<{
      nodes: CellNodes;
      colors: string[];
    }>
  >;
}

/**
 * Colors per section (soma, axon, dendrite, ...).
 */
const COLORS = ["#333", "#00f", "#f00", "#f0f", "#8a8"];

const defaultTextLoader = async (
  href: string
): Promise<
  Array<{
    nodes: CellNodes;
    colors: string[];
  }>
> => {
  const resp = await fetch(`${basePath}/${href}`);
  const text = await resp.text();
  return [{ nodes: parseSwc(text), colors: COLORS }];
};

export function SwcViewer({
  className,
  href,
  loader = defaultTextLoader,
}: SwcViewerProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const refWatcher = React.useRef(new PixelScaleWatcher());
  const refContainer = React.useRef<HTMLDivElement | null>(null);
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refGizmo = React.useRef(new GizmoCanvas());
  const refContext = React.useRef<TgdContext | null>(null);
  React.useEffect(() => {
    const action = async () => {
      setBusy(true);
      setError("");
      try {
        const canvas = refCanvas.current;
        if (!canvas) return;

        const morphologies = await loader(href);
        if (!morphologies) return;

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
          })
        );
        const center = new TgdVec3();
        let minY = Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        for (const { nodes, colors } of morphologies) {
          center.add(nodes.center);
          const halfHeight = nodes.bbox[1] * 0.5;
          minY = Math.min(minY, nodes.center.y - halfHeight);
          maxY = Math.max(maxY, nodes.center.y + halfHeight);
          const data = nodesToSegmentsData(nodes);
          const painter = new TgdPainterSegments(context, data, {
            minRadius: 0.25,
          });
          painter.colorTexture.makePalette(colors);
          const painterOutline = new TgdPainterSegments(context, data, {
            minRadius: 0.25,
          });
          painterOutline.radiusMultiplier = 1.2;
          painterOutline.light = 0;
          painterOutline.shiftZ = 2;
          context.add(painter, painterOutline);
        }
        context.camera.spaceHeightAtTarget = Math.abs(maxY - minY);
        center.scale(1 / morphologies.length);
        context.camera.target = center;
        context.paint();
        refContext.current = context;
      } catch (ex) {
        console.error("Unable to load data for SwcViewer!");
        console.error(ex);
        const msg = ex instanceof Error ? ex.message : JSON.stringify(ex);
        setError(msg);
      } finally {
        setBusy(false);
      }
    };
    void action();
  }, [href, loader]);
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
      {busy && (
        <div className={styles.busy}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>loading</title>
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}
