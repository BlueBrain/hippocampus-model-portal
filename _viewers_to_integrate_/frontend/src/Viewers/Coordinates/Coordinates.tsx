import React from "react"
import Scene from "./Scene"
import { MeshInfo } from "@/types"
import { getGradientCanvas } from "../../utils/gradient"
import Selector from "./Selector"

import Styles from "./Coordinates.module.css"
import { Spin } from "@/components/Spin"
import { loadData, loadInfo } from "@/utils/loaders"

export interface AppProps {
    className?: string
}

export default function CoordinatesViewer({ className }: AppProps) {
    const mesh = useMesh()
    return (
        <div className={getClassName(className)}>
            {mesh && (
                <Scene
                    className={Styles.canvas}
                    meshInfo={mesh.meshInfo}
                    vert={mesh.vert}
                    elem={mesh.elem}
                />
            )}
            <div className={Styles.colorrampContainer}>
                <div>0.0</div>
                <Gradient />
                <div>1.0</div>
            </div>
            <Selector className={Styles.selector} />
            <Spin visible={!mesh} />
        </div>
    )
}

function getClassName(className?: string) {
    const classes = [Styles["App"]]
    if (className) classes.push(className)
    return classes.join(" ")
}

function Gradient() {
    return (
        <div
            className={Styles.colorramp}
            ref={(div) => {
                div?.appendChild(getGradientCanvas())
            }}
        ></div>
    )
}

function useMesh(): {
    meshInfo: MeshInfo
    vert: Float32Array
    elem: Uint32Array
} | null {
    const [mesh, setMesh] = React.useState<{
        meshInfo: MeshInfo
        vert: Float32Array
        elem: Uint32Array
    } | null>(null)
    React.useEffect(() => {
        const action = async () => {
            const meshInfo = await loadInfo("./data/coordinates/mesh.json")
            const elem = new Uint32Array(
                await loadData("./data/coordinates/elem.dat")
            )
            const vert = new Float32Array(
                await loadData("./data/coordinates/vert.dat")
            )
            setMesh({ meshInfo, vert, elem })
        }
        void action()
    }, [])
    return mesh
}
