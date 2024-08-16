import React, { useRef, useEffect } from "react";
import Styles from "./Scene.module.css";
import Painter from "./painter";
import { MeshInfo } from "../types";

export interface SceneProps {
    className?: string;
    meshInfo: MeshInfo;
    vert: Float32Array;
    elem: number[];
    onPainterInit?: (painter: Painter) => void;  // Add this prop to pass Painter instance
}

export default function Scene({ className = "", meshInfo, vert, elem, onPainterInit }: SceneProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const painterRef = useRef<Painter | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const painter = new Painter(canvasRef.current, meshInfo, vert, elem);
            painterRef.current = painter;
            if (onPainterInit) {
                onPainterInit(painter);  // Pass the painter instance
            }
        }
    }, [meshInfo, vert, elem, onPainterInit]);

    return (
        <canvas
            className={`${className} ${Styles.Scene}`}
            ref={canvasRef}
        ></canvas>
    );
}