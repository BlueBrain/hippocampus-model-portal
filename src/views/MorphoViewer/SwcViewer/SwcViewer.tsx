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
  TgdTexture2D,
  TgdTexture2DOptions,
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
import { classNames } from "@/utils";
import { Legend } from "./Legend/Legend";

export type SwcViewerLoader = (href: string) => Promise<{
  /**
   * You can define a custom legend based on the loaded data.
   */
  legend?: SwcViewerLegend;
  morphologies: Array<{
    nodes: CellNodes;
    colors: string[];
    texture?: Partial<TgdTexture2DOptions>;
    minRadius?: number;
    roundness?: number;
    center?: TgdVec3;
  }>;
}>;

/**
 * Pass an array to get one color per section.
 * Pass an object to get a linear gradient.
 */
export type SwcViewerLegend =
  | Array<{ label: string; color: string }>
  | {
      labelMin: string;
      labelMax: string;
      colorRamp: string[];
    };

export interface SwcViewerProps {
  className?: string;
  href: string;
  loader?: SwcViewerLoader;
  /**
   * If missing, a default legend with soma, axon and dendrite will be shown.
   * Pass an array to get one color per section.
   * Pass an object to get a linear gradient.
   */
  legend?: SwcViewerLegend;
}

/**
 * Colors per section (soma, axon, dendrite, ...).
 */
const COLORS = ["#333", "#00f", "#f00", "#f0f", "#8a8"];

const DEFAULT_LEGEND = [
  { label: "Soma", color: COLORS[0] },
  { label: "Axon", color: COLORS[1] },
  { label: "Dendrites", color: COLORS[2] },
];

const defaultTextLoader: SwcViewerLoader = async (url: string) => {
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    return { morphologies: [{ nodes: parseSwc(text), colors: COLORS }] };
  } catch (ex) {
    console.error("Unable to fetch this URL:", url);
    console.error(ex);
    throw Error(`Unable to fetch ${url}!`);
  }
};

export function SwcViewer({
  className,
  href,
  loader = defaultTextLoader,
  legend: initialLegend,
}: SwcViewerProps) {
  const [legend, setLegend] = React.useState<SwcViewerLegend | undefined>(
    initialLegend
  );
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const refWatcher = React.useRef(new PixelScaleWatcher());
  const refContainer = React.useRef<HTMLDivElement | null>(null);
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refGizmo = React.useRef(new GizmoCanvas());
  const refContext = React.useRef<TgdContext | null>(null);
  useViewerInit(
    setBusy,
    setError,
    refCanvas,
    loader,
    href,
    refContext,
    refWatcher,
    refGizmo,
    setLegend
  );
  const handleFullscreen = () => tgdFullscreenToggle(refContainer.current);

  return (
    <div
      className={classNames(styles.main, className)}
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
      <Legend values={legend ?? DEFAULT_LEGEND} />
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
function useViewerInit(
  setBusy: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  refCanvas: React.MutableRefObject<HTMLCanvasElement | null>,
  loader: SwcViewerLoader,
  href: string,
  refContext: React.MutableRefObject<TgdContext | null>,
  refWatcher: React.MutableRefObject<PixelScaleWatcher>,
  refGizmo: React.MutableRefObject<GizmoCanvas>,
  setLegend: (legend?: SwcViewerLegend) => void
) {
  /**
   * We use this query counter to be sure that an old query is not
   * reporting an error if a new one is ongoing.
   */
  const refQueryCounter = React.useRef(0);
  React.useEffect(() => {
    const action = async () => {
      setBusy(true);
      setError("");
      refQueryCounter.current++;
      const queryId = refQueryCounter.current;
      try {
        const canvas = refCanvas.current;
        if (!canvas) return;

        const viewOptions = await loader(href);
        if (!viewOptions) return;

        if (viewOptions.legend) setLegend(viewOptions.legend);
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
        const target = new TgdVec3();
        let minY = Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        for (const {
          nodes,
          colors,
          texture,
          minRadius,
          roundness,
          center,
        } of viewOptions.morphologies) {
          target.add(center ?? nodes.center);
          const halfHeight = nodes.bbox[1] * 0.5;
          minY = Math.min(minY, nodes.center.y - halfHeight);
          maxY = Math.max(maxY, nodes.center.y + halfHeight);
          const data = nodesToSegmentsData(nodes);
          const painter = new TgdPainterSegments(context, data, {
            minRadius: minRadius ?? 0.25,
            roundness,
            colorTexture: context.textures2D.create({
              magFilter: "NEAREST",
              minFilter: "NEAREST",
              wrapR: "CLAMP_TO_EDGE",
              wrapS: "CLAMP_TO_EDGE",
              wrapT: "CLAMP_TO_EDGE",
              ...texture,
            }),
          });
          painter.colorTexture.makePalette(colors);
          const painterOutline = new TgdPainterSegments(context, data, {
            minRadius: minRadius ?? 0.25,
            roundness,
            radiusMultiplier: 1.2,
            light: 0,
            shiftZ: 2,
          });
          context.add(painter, painterOutline);
        }
        context.camera.spaceHeightAtTarget = Math.abs(maxY - minY);
        target.scale(1 / viewOptions.morphologies.length);
        context.camera.target = target;
        context.paint();
        refContext.current = context;
      } catch (ex) {
        console.error("Unable to load data for SwcViewer!", href);
        console.error(ex);
        if (queryId < refQueryCounter.current) return;

        const msg = ex instanceof Error ? ex.message : JSON.stringify(ex);
        setError(`Unable to load from "${href}"!\n${msg}`);
      } finally {
        setBusy(false);
      }
    };
    void action();
  }, [
    href,
    loader,
    refCanvas,
    refContext,
    refGizmo,
    refWatcher,
    setBusy,
    setError,
    setLegend,
  ]);
}
