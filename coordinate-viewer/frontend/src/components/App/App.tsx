import React from "react"
import Scene from "../Scene"
import State from "../../state"
import { MeshInfo } from "@/types"
import { getGradientCanvas } from "../../utils/gradient"
import Selector from "../Selector"
import Styles from "./App.module.css"

export interface AppProps {
    className?: string
    meshInfo: MeshInfo
    vert: Float32Array
    elem: number[]
}

export default function ({ className, meshInfo, vert, elem }: AppProps) {
    return (
        <div className={getClassName(className)}>
            <Scene
                className={Styles.canvas}
                meshInfo={meshInfo}
                vert={vert}
                elem={elem}
            />
            <div className={Styles.colorrampContainer}>
                <div>0.0</div>
                <Gradient />
                <div>1.0</div>
            </div>
            <Selector className={Styles.selector} />
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
