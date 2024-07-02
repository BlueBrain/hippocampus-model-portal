import React, { useRef, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined, FullscreenExitOutlined, SettingOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Tooltip } from 'antd';

import { Layer, VolumeSection } from '@/types';
import { layers } from '@/constants';

import VolumeViewer from './volume-viewer';
import { color } from './constants';
import Legend from './Legend';

import styles from './volume-viewer.module.scss';

export type VolumeViewerProps = {
  meshPath: string;
  volumeSection: VolumeSection;
  onReady?: () => void;
};

const defaultLayerVisibilityState: Record<Layer, boolean> = {
  SLM: true,
  SR: true,
  SP: true,
  SO: true,
};

// using bracket access to make linter not complain about non-existent prop
const isFullscreenAvailable = document.fullscreenEnabled || document['webkitFullscreenEnabled'];

const VolumeViewerComponent: React.FC<VolumeViewerProps> = ({ meshPath, volumeSection, onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [volumeViewer, setVolumeViewer] = useState<VolumeViewer | null>(null);
  const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);
  const fullscreenHandle = useFullScreenHandle();

  const [layerVisibilityState, setLayerVisibilityState] = useState(defaultLayerVisibilityState);
  const [regionMaskVisible, setRegionMaskVisible] = useState(true);

  const updateLayerVisibility = (layerVisibilityState: Record<Layer, boolean>) => {
    setLayerVisibilityState(layerVisibilityState);
    volumeViewer?.setLayerVisibility(layerVisibilityState);
  };

  const updateRegionMaskVisibility = (visible: boolean) => {
    setRegionMaskVisible(visible);
    volumeViewer?.setRegionMaskVisibility(visible);
  };

  const toggleFullscreen = () => {
    if (fullscreenHandle.active) {
      fullscreenHandle.exit();
    } else {
      fullscreenHandle.enter();
    }
  };

  const downloadRender = () => {
    const imageName = `volume_render_CA1_${volumeSection}`;
    volumeViewer?.downloadRender(imageName);
  };

  useEffect(() => {
    if (!meshPath || !containerRef.current) return;

    const containerNode = containerRef.current;
    const viewer = new VolumeViewer(containerNode);
    setVolumeViewer(viewer);

    viewer.init(meshPath, volumeSection).then(() => {
      if (onReady) {
        onReady();
      }
    });

    return () => {
      viewer.destroy();
    };
  }, [meshPath, containerRef, volumeSection, onReady]);

  useEffect(() => {
    if (volumeViewer && volumeSection) {
      volumeViewer.setVolumeSection(volumeSection, layerVisibilityState);
    }
  }, [volumeViewer, volumeSection, layerVisibilityState]);

  return (
    <div>
      <FullScreen
        className={fullscreenHandle.active ? undefined : styles.fixedAspectRatio}
        handle={fullscreenHandle}
      >
        <div className={styles.container} ref={containerRef}>
          <Tooltip title="Viewer settings">
            <Button
              className={styles.settingBtn}
              size="small"
              onClick={() => setSettingDrawerVisible(true)}
              icon={<SettingOutlined />}
            />
          </Tooltip>

          <div className={styles.topRightCtrlGroup}>
            <Tooltip title="Download render as a PNG">
              <Button
                size="small"
                onClick={downloadRender}
                icon={<CameraOutlined />}
              />
            </Tooltip>
            {isFullscreenAvailable && (
              <Tooltip title="Fullscreen">
                <Button
                  size="small"
                  className="ml-1"
                  onClick={toggleFullscreen}
                  icon={fullscreenHandle.active ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                />
              </Tooltip>
            )}
          </div>

          <Legend />

          <Drawer
            title="Viewer settings"
            placement="left"
            closable={true}
            width={240}
            onClose={() => setSettingDrawerVisible(false)}
            open={settingDrawerVisible}
            getContainer={false}
            style={{ position: 'absolute' }}
          >
            <div>
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.REGION } as React.CSSProperties}
                defaultChecked={regionMaskVisible}
                onChange={(e) => {
                  const { checked: visible } = e.target;
                  updateRegionMaskVisibility(visible);
                }}
              >
                CA1 region mask
              </Checkbox>
            </div>

            <h4 className="mt-2">Layers</h4>

            {layers.map(layer => (
              <div className="mt-1" key={layer}>
                <Checkbox
                  className={styles.coloredCheckbox}
                  style={{ '--checkbox-color': color[layer] } as React.CSSProperties}
                  defaultChecked={layerVisibilityState[layer]}
                  onChange={(e) => {
                    const { checked: visible } = e.target;
                    updateLayerVisibility({ ...layerVisibilityState, [layer]: visible });
                  }}
                >
                  {layer}
                </Checkbox>
              </div>
            ))}
          </Drawer>
        </div>
      </FullScreen>
    </div>
  );
};

export default VolumeViewerComponent;