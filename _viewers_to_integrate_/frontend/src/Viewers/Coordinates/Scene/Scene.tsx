import React from "react"
import Styles from "./Scene.module.css"
import Painter from "./painter"
import { MeshInfo } from "@/types"

export interface AppProps {
    className?: string
    meshInfo: MeshInfo
    vert: Float32Array
    elem: Uint32Array
}

export default function Scene({
    className = "",
    meshInfo,
    vert,
    elem,
}: AppProps) {
    const handleCanvasMounted = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return

        new Painter(canvas, meshInfo, vert, elem)
    }
    return (
        <canvas
            className={`${className} ${Styles.Scene}`}
            ref={handleCanvasMounted}
        ></canvas>
    )
}
