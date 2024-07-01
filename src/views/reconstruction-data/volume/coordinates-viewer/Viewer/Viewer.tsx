// Viewer.tsx
import React, { useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined, FullscreenExitOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { saveAs } from 'file-saver';
import { WebGLRenderer } from 'three';
import Scene from '../Scene';
import { MeshInfo } from '../types';
import { getGradientCanvas } from '../utils';
import Selector from '../Selector';
import Styles from './viewer.module.scss';

export interface VectorsViewerProps {
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

const Viewer: React.FC<VectorsViewerProps> = ({
    className,
    meshInfo = defaultMeshInfo,
    vert = defaultVert,
    elem = defaultElem,
}) => {
    const fullscreenHandle = useFullScreenHandle();
    const [painter, setPainter] = useState<Painter | null>(null);

    const toggleFullscreen = () => {
        if (fullscreenHandle.active) {
            fullscreenHandle.exit();
        } else {
            fullscreenHandle.enter();
        }
    };

    const downloadRender = (filename: string) => {
        if (!painter) return;

        const { clientWidth, clientHeight } = painter.renderer.domElement.parentElement as HTMLElement;

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            physicallyCorrectColors: true,
        });

        renderer.setSize(clientWidth * 3, clientHeight * 3);
        renderer.render(painter.scene, painter.camera);

        renderer.domElement.toBlob(blob => {
            if (blob) {
                saveAs(blob, `${filename}.png`);
            }
        });
        renderer.dispose();
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
                        onClick={() => downloadRender(`volume_render_CA1`)}
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
                    onPainterInit={setPainter}
                />
                <div className={Styles.colorrampContainer}>
                    <div style={{ color: 'white' }}>0.0</div>
                    <Gradient />
                    <div style={{ color: 'white' }}>1.0</div>
                </div>
                <Selector className={Styles.selector} />
            </div>
        </FullScreen>
    );
};

function getClassName(className?: string) {
    const classes = [Styles['App']];
    if (className) classes.push(className);
    return classes.join(' ');
}

function Gradient() {
    return (
        <div
            style={{ width: '100px', height: '100px' }}
            className={Styles.colorramp}
            ref={(div) => {
                div?.appendChild(getGradientCanvas());
            }}
        ></div>
    );
}

export default Viewer;