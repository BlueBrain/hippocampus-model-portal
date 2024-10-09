import React, { useEffect, useRef } from 'react';
import { MorphologyCanvas } from "@bbp/morphoviewer";

const MorphologyViewer: React.FC<{ swc: string }> = ({ swc }) => {
  const refViewer = useRef<MorphologyCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && !refViewer.current) {
      refViewer.current = new MorphologyCanvas();
      refViewer.current.canvas = canvasRef.current;
      refViewer.current.swc = swc;
    }
  }, [swc]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '400px' }} />;
};

export default MorphologyViewer;