import React from "react";
import Scene from "./Scene";
import { MeshInfo } from "./types";
import { getGradientCanvas } from "./utils";
import Selector from "./Selector";

import Styles from "./vector-viewer.module.scss";

export interface AppProps {
    className?: string;
    meshInfo?: MeshInfo;
    vert?: Float32Array;
    elem?: number[];
}

const defaultMeshInfo: MeshInfo = {
    min: [0, 0, 0],
    max: [1, 1, 1]
};

const defaultVert = new Float32Array([0, 0, 0, 1, 1, 1]);
const defaultElem = [0, 1, 2];

export default function ({ className, meshInfo = defaultMeshInfo, vert = defaultVert, elem = defaultElem }: AppProps) {
    console.log("VectorViewer - meshInfo:", meshInfo);

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
    );
}

function getClassName(className?: string) {
    const classes = [Styles["App"]];
    if (className) classes.push(className);
    return classes.join(" ");
}

function Gradient() {
    return (
        <div
            style={{ width: "200px", height: "200px" }}
            className={Styles.colorramp}
            ref={(div) => {
                div?.appendChild(getGradientCanvas());
            }}
        ></div>
    );
}