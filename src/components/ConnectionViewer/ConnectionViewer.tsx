import React, { useRef, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { Button, Row, Col, Checkbox, Radio, Divider } from 'antd';

import ConnectionViewer from './connection-viewer';
import { NeuriteType } from './constants';

import style from './connection-viewer.module.scss';

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

const ConnectionViewerComponent: React.FC<ConnectionViewerProps> = ({ data, onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [connectionViewer, setConnectionViewer] = useState<ConnectionViewer>(null);
  const fullscreenHandle = useFullScreenHandle();

  const [preAxonType, setPreAxonType] = useState<VisibilityType>('full');
  const [postDendType, setPostDendType] = useState<VisibilityType>('full');

  const [visibilityCtrlState, setVisibilityCtrlState] = useState(defaultVisibilityCtrlState);

  const updateVisibility = (visibility) => {
    connectionViewer.setNeuriteVisibility(visibility);
  };

  const resize = () => {
    if (!connectionViewer) return;

    connectionViewer.resize();
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
        className={fullscreenHandle.active ? undefined : style.fixedAspectRatio}
        onChange={resize}
        handle={fullscreenHandle}
      >
        <div className={style.containerInner} ref={containerRef}>
          <Button
            className={style.fullscreenBtn}
            onClick={toggleFullscreen}
            icon={fullscreenHandle.active ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          />
          <div className={style.legend}>
            <Row gutter={18}>
              <Col span={12}>
                <h4>PRE</h4>
                <div>
                  <Checkbox
                    className={`${style.coloredCheckbox} ${style.preAxonCheckbox}`}
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
                    axon
                  </Checkbox>
                  <Radio.Group
                    defaultValue="full"
                    size="small"
                    disabled={!visibilityCtrlState.preAxon}
                    onChange={(e) => {
                      const preAxonType = e.target.value;
                      setPreAxonType(preAxonType);
                      updateVisibility({ [NeuriteType.PRE_NB_AXON]: preAxonType === 'full' });
                    }}
                  >
                    <Radio.Button value="full">Full</Radio.Button>
                    <Radio.Button value="synPath">Syn path</Radio.Button>
                  </Radio.Group> <br/>
                  <Checkbox
                    className={`${style.coloredCheckbox} ${style.preDendCheckbox}`}
                    defaultChecked={visibilityCtrlState.preDend}
                    onChange={(e) => updateVisibility({ [NeuriteType.PRE_NB_DEND]: e.target.checked })}
                  >
                    dend
                  </Checkbox>
                </div>
              </Col>
              <Col span={12}>
                <h4>POST</h4>
                <div>
                  <Checkbox
                    className={`${style.coloredCheckbox} ${style.postDendCheckbox}`}
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
                    dend
                  </Checkbox>
                  <Radio.Group
                    defaultValue="full"
                    size="small"
                    disabled={!visibilityCtrlState.postDend}
                    onChange={(e) => {
                      const postDendType = e.target.value;
                      setPostDendType(postDendType);
                      updateVisibility({ [NeuriteType.POST_NB_DEND]: postDendType === 'full' });
                    }}
                  >
                    <Radio.Button value="full">Full</Radio.Button>
                    <Radio.Button value="synPath">Syn path</Radio.Button>
                  </Radio.Group> <br/>
                  <Checkbox
                    className={`${style.coloredCheckbox} ${style.postAxonCheckbox}`}
                    defaultChecked={visibilityCtrlState.postAxon}
                    onChange={(e) => updateVisibility({ [NeuriteType.POST_NB_AXON]: e.target.checked })}
                  >
                    axon
                  </Checkbox>
                </div>
              </Col>
            </Row>
            {/* <Divider /> */}
          </div>
        </div>
      </FullScreen>
    </div>
  );
};


export default ConnectionViewerComponent;
