import React, { useRef, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined, FullscreenExitOutlined, SettingOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Checkbox, Segmented, Drawer, Tooltip } from 'antd';

import ConnectionViewer from './connection-viewer';
import { color, NeuriteType } from './constants';
import Legend from './Legend';

import styles from './connection-viewer.module.scss';

export type ConnectionViewerProps = {
  data: any;
  onReady: () => void;
};

type VisibilityType = 'full' | 'synPath';

const defaultVisibilityCtrlState = {
  preDend: true,
  preAxon: true,
  postDend: true,
  postAxon: false,
};

// using bracket access to make linter not complain about non-existent prop
const isFullscreenAvailable = document.fullscreenEnabled || document['webkitFullscreenEnabled'];

const ConnectionViewerComponent: React.FC<ConnectionViewerProps> = ({ data, onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [connectionViewer, setConnectionViewer] = useState<ConnectionViewer | null>(null);
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);
  const fullscreenHandle = useFullScreenHandle();

  const [preAxonType, setPreAxonType] = useState<VisibilityType>('full');
  const [postDendType, setPostDendType] = useState<VisibilityType>('full');

  const [visibilityCtrlState, setVisibilityCtrlState] = useState(defaultVisibilityCtrlState);

  // TODO: move viewer settings to a separate component
  const updateVisibility = (visibility: Record<string, boolean>) => {
    if (connectionViewer) {
      connectionViewer.setNeuriteVisibility(visibility);
    }
  };

  const toggleFullscreen = () => {
    if (fullscreenHandle.active) {
      fullscreenHandle.exit();
    } else {
      fullscreenHandle.enter();
    }
  };

  const downloadRender = () => {
    if (connectionViewer) {
      const imageName = `exemplar_connection_render_${data.pre.mtype}-${data.post.mtype}`;
      connectionViewer.downloadRender(imageName);
    }
  };

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const containerNode = containerRef.current;

    const viewer = new ConnectionViewer(containerNode);
    setConnectionViewer(viewer);

    viewer.init(data).then(() => {
      viewer.setNeuriteVisibility({ [NeuriteType.POST_NB_AXON]: false });
      onReady();
    });

    return () => {
      if (viewer) viewer.destroy();
    };
  }, [containerRef, data]);

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
              onClick={() => setSettingDrawerOpen(true)}
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
            width={250}
            onClose={() => setSettingDrawerOpen(false)}
            open={settingDrawerOpen}
            getContainer={false}
            style={{ position: 'absolute' }}
          >
            <h3>Neurite visibility</h3>

            <h4>Pre-synaptic</h4>
            <div>
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.PRE_DEND } as React.CSSProperties}
                defaultChecked={visibilityCtrlState.preDend}
                onChange={(e) => {
                  const { checked: visible } = e.target;
                  setVisibilityCtrlState({
                    ...visibilityCtrlState,
                    preDend: visible,
                  });
                  updateVisibility({ [NeuriteType.PRE_NB_DEND]: visible });
                }}
              >
                Dendrite
              </Checkbox>
            </div>
            <div className="mt-1">
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.PRE_AXON, minWidth: '86px' } as React.CSSProperties}
                defaultChecked={visibilityCtrlState.preAxon}
                onChange={(e) => {
                  const { checked: visible } = e.target;
                  setVisibilityCtrlState({
                    ...visibilityCtrlState,
                    preAxon: visible,
                  });

                  updateVisibility({
                    [NeuriteType.PRE_B_AXON]: visible,
                    [NeuriteType.PRE_NB_AXON]: preAxonType === 'full' ? visible : false,
                  });
                }}
              >
                Axon
              </Checkbox>
              <Segmented
                className="ml-1"
                size="small"
                options={['full', 'synPath']}
                defaultValue={preAxonType}
                onChange={(value) => {
                  const newValue = value as VisibilityType;
                  setPreAxonType(newValue);
                  updateVisibility({ [NeuriteType.PRE_NB_AXON]: newValue === 'full' });
                }}
              />
            </div>

            <h4 className="mt-2">Post-synaptic</h4>
            <div>
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.POST_DEND, minWidth: '86px' } as React.CSSProperties}
                defaultChecked={visibilityCtrlState.postDend}
                onChange={(e) => {
                  const { checked: visible } = e.target;
                  setVisibilityCtrlState({
                    ...visibilityCtrlState,
                    postDend: visible,
                  });

                  updateVisibility({
                    [NeuriteType.POST_B_DEND]: visible,
                    [NeuriteType.POST_NB_DEND]: postDendType === 'full' ? visible : false,
                  });
                }}
              >
                Dendrite
              </Checkbox>
              <Segmented
                className="ml-1"
                size="small"
                options={['full', 'synPath']}
                defaultValue={postDendType}
                onChange={(value) => {
                  const newValue = value as VisibilityType;
                  setPostDendType(newValue);
                  updateVisibility({ [NeuriteType.POST_NB_DEND]: newValue === 'full' });
                }}
              />
            </div>
            <div className="mt-1">
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.POST_AXON } as React.CSSProperties}
                defaultChecked={visibilityCtrlState.postAxon}
                onChange={(e) => {
                  const { checked: visible } = e.target;
                  setVisibilityCtrlState({
                    ...visibilityCtrlState,
                    postAxon: visible,
                  });
                  updateVisibility({ [NeuriteType.POST_NB_AXON]: visible });
                }}
              >
                Axon
              </Checkbox>
            </div>
          </Drawer>
        </div>
      </FullScreen>
    </div>
  );
};

export default ConnectionViewerComponent;