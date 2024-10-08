import { useEffect, useRef, useState } from "react";

import { computeScalebarAttributes, ScalebarOptions } from "./compute-scalebar";
import { PixelScaleWatcher } from "./pixel-scale-watcher";

import styles from "./scalebar.module.css";

export interface VerticalScalebarProps {
  className?: string;
  pixelScaleWatcher: PixelScaleWatcher;
  color?: string;
}

export function Scalebar({
  className,
  pixelScaleWatcher,
  color = "#000e",
}: VerticalScalebarProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const scalebar = useScalebar(pixelScaleWatcher);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !scalebar) return;

    paint(canvas, scalebar, color);
  }, [scalebar, color]);

  if (!scalebar) return null;

  return (
    <div className={`${styles.main} ${className ?? ""}`}>
      <canvas ref={ref} />
    </div>
  );
}

interface ScalebarAttributes {
  sizeInPixel: number;
  value: number;
  unit: string;
}

const options: Partial<ScalebarOptions> = {
  preferedSizeInPixels: 100,
};

function useScalebar(
  pixelScaleWatcher: PixelScaleWatcher
): ScalebarAttributes | null {
  const [scalebar, setScalebar] = useState(
    computeScalebarAttributes(pixelScaleWatcher.pixelScale, options)
  );
  useEffect(() => {
    const update = () => {
      setScalebar(
        computeScalebarAttributes(pixelScaleWatcher.pixelScale, options)
      );
    };
    pixelScaleWatcher.eventPixelScaleChange.addListener(update);
    return () => pixelScaleWatcher.eventPixelScaleChange.removeListener(update);
  }, [pixelScaleWatcher]);
  return scalebar;
}

function paint(
  canvas: HTMLCanvasElement,
  scalebar: ScalebarAttributes,
  color: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  // eslint-disable-next-line no-param-reassign
  canvas.width = w;
  // eslint-disable-next-line no-param-reassign
  canvas.height = h;
  const fontHeight = 12;
  const margin = fontHeight / 4;
  ctx.font = `${fontHeight}px sans-serif`;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  // For the line to be one precise pixel, we need to
  // set its x coordinate to 1/2. Otherwise, it will
  // be blured accross to consecutive pixels.
  let x = 0.5;
  const y = (fontHeight + h) / 2;
  let value = 0;
  while (x < w) {
    if (value === 0) {
      //   ctx.font = `bold ${fontHeight}px sans-serif`;
      //   ctx.fillText(`[${scalebar.unit}]`, x + margin, y);
    } else {
      ctx.font = `${fontHeight}px sans-serif`;
      const text = `${value} ${scalebar.unit}`;
      ctx.fillText(text, x + margin, y);
    }
    value += scalebar.value;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    x += scalebar.sizeInPixel;
  }
}
