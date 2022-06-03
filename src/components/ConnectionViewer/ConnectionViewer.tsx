import React, { useRef, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined, FullscreenExitOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Segmented, Drawer } from 'antd';

import ConnectionViewer from './connection-viewer';
import { color, NeuriteType } from './constants';
import Legend from './Legend';

import styles from './connection-viewer.module.scss';

export type ConnectionViewerProps = {
  data: any;
  onReady: () => void
};

type VisibilityType = 'full' | 'synPath';

const defaultVisibilityCtrlState = {
  preDend: true,
  preAxon: true,
  postDend: true,
  postAxon: true,
};

// using bracket access to make linter not complain about non-existent prop
const isFullscreenAvailable = document.fullscreenEnabled || document['webkitFullscreenEnabled'];

const ConnectionViewerComponent: React.FC<ConnectionViewerProps> = ({ data, onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [connectionViewer, setConnectionViewer] = useState<ConnectionViewer>(null);
  const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);
  const fullscreenHandle = useFullScreenHandle();

  const [preAxonType, setPreAxonType] = useState<VisibilityType>('full');
  const [postDendType, setPostDendType] = useState<VisibilityType>('full');

  const [visibilityCtrlState, setVisibilityCtrlState] = useState(defaultVisibilityCtrlState);

  const updateVisibility = (visibility) => {
    connectionViewer.setNeuriteVisibility(visibility);
  };

  const toggleFullscreen = () => {
    if (fullscreenHandle.active) {
     fullscreenHandle.exit();
    } else {
      fullscreenHandle.enter();
    }
  }

  useEffect(() => {
    if (!data || !containerRef || !containerRef.current) return;

    const containerNode = containerRef.current;

    const connectionViewer = new ConnectionViewer(containerNode);
    setConnectionViewer(connectionViewer);

    connectionViewer.init(data).then(onReady);

    return () => {
      if (connectionViewer) connectionViewer.destroy();
    };
  }, [containerRef, data]);

  return (
    <div>
      <FullScreen
        className={fullscreenHandle.active ? undefined : styles.fixedAspectRatio}
        handle={fullscreenHandle}
      >
        <div className={styles.container} ref={containerRef}>
          <Button
            className={styles.settingBtn}
            size="small"
            onClick={() => setSettingDrawerVisible(true)}
            icon={<SettingOutlined />}
          />

          {isFullscreenAvailable && (
            <Button
              size="small"
              className={styles.fullscreenBtn}
              onClick={toggleFullscreen}
              icon={fullscreenHandle.active ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            />
          )}

          <Legend />

          <Drawer
            title="Viewer settings"
            placement="left"
            closable={true}
            width={240}
            onClose={() => setSettingDrawerVisible(false)}
            visible={settingDrawerVisible}
            getContainer={false}
            style={{ position: 'absolute' }}
          >
            <h3>Neurite visibility</h3>

            <h4>PRE</h4>
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
                Dend
              </Checkbox> <br />
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.PRE_AXON } as React.CSSProperties}
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
                size="small"
                options={['full', 'synPath']}
                defaultValue={preAxonType}
                onChange={(preAxonType) => {
                  setPreAxonType(preAxonType as VisibilityType);
                  updateVisibility({ [NeuriteType.PRE_NB_AXON]: preAxonType === 'full' });
                }}
              />
            </div>

            <h4 className="mt-2">POST</h4>
            <div>
              <Checkbox
                className={styles.coloredCheckbox}
                style={{ '--checkbox-color': color.POST_DEND } as React.CSSProperties}
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
                Dend
              </Checkbox>
              <Segmented
                size="small"
                options={['full', 'synPath']}
                defaultValue={postDendType}
                onChange={(postDendType) => {
                  setPostDendType(postDendType as VisibilityType);
                  updateVisibility({ [NeuriteType.POST_NB_DEND]: postDendType === 'full' });
                }}
              />
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
