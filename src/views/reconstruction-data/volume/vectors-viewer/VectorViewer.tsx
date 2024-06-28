import React from "react";

import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined, FullscreenExitOutlined, SettingOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Tooltip } from 'antd';

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
    const fullscreenHandle = useFullScreenHandle();

    const toggleFullscreen = () => {
        if (fullscreenHandle.active) {
            fullscreenHandle.exit();
        } else {
            fullscreenHandle.enter();
        }
    };

    return (
        <FullScreen
            className={fullscreenHandle.active ? undefined : Styles.fixedAspectRatio}
            handle={fullscreenHandle}
        >

            <div className={Styles.topRightCtrlGroup}>
                <Tooltip title="Download render as a PNG">
                    <Button
                        size="small"
                        //onClick={downloadRender}
                        icon={<CameraOutlined />}
                    />
                </Tooltip>

                <Tooltip title="Fullscreen">
                    <Button
                        size="small"
                        className="ml-1"
                        onClick={toggleFullscreen}
                        icon={fullscreenHandle.active ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    />
                </Tooltip>

            </div>

            <div className={getClassName(className)}>
                <Scene
                    className={Styles.canvas}
                    meshInfo={meshInfo}
                    vert={vert}
                    elem={elem}
                />
                <div className={Styles.colorrampContainer}>
                    <div style={{ color: "white" }}>0.0</div>
                    <Gradient />
                    <div style={{ color: "white" }}>1.0</div>
                </div>
                <Selector className={Styles.selector} />
            </div>
        </FullScreen>
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
            style={{ width: "100px", height: "100px" }}
            className={Styles.colorramp}
            ref={(div) => {
                div?.appendChild(getGradientCanvas());
            }}
        ></div>
    );
}