import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Spin } from 'antd';
import chunk from 'lodash/chunk';

import { Layer } from '@/types';
import { pathwayIndexPath, connectionViewerDataPath } from '@/queries/http';
import { colorName } from './config';
import Filters from '../../layouts/Filters';
import StickyContainer from '../../components/StickyContainer';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import DataContainer from '../../components/DataContainer';
import Collapsible from '../../components/Collapsible';
import ConnectionViewer from '@/components/ConnectionViewer';
import HttpData from '@/components/HttpData';
import LayerSelector from '@/components/LayerSelector';
import List from '@/components/List';

import selectorStyle from '../../styles/selector.module.scss';


type PathwayIndex = {
  pathways: number[];
  mtypeIdx: string[];
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const SynapticPathwaysView: React.FC = () => {
  const router = useRouter();

  const { prelayer, postlayer, pretype, posttype } = router.query as Record<string, string>;

  const [pathwayIndex, setPathwayIndex] = useState<PathwayIndex>(null);
  const [connViewerReady, setConnViewerReady] = useState<boolean>(false);

  const setParams = (params: Record<string, string>): void => {
    const query = { ...router.query, ...params };
    router.push({ query }, undefined, { shallow: true });
  };

  const setPreLayerQuery = (layer: Layer) => {
    setParams({
      prelayer: layer,
      postlayer: null,
      pretype: null,
      posttype: null,
    });
  };

  const setPostLayerQuery = (layer: Layer) => {
    setParams({
      postlayer: layer,
      posttype: null,
    });
  };

  const setPreTypeQuery = (pretype: string) => {
    setParams({
      pretype,
      posttype: null,
    });
  };

  const setPostTypeQuery = (posttype: string) => {
    setParams({
      posttype,
    });
  };

  const getPreMtypes = (prelayer) => {
    if (!pathwayIndex || !prelayer) return [];

    return chunk(pathwayIndex.pathways, 2)
      .map(([preMtypeIdx]) => pathwayIndex.mtypeIdx[preMtypeIdx])
      .filter(onlyUnique)
      .filter(mtype => mtype.match(prelayer))
      .sort();
  };

  const preMtypes = getPreMtypes(prelayer);

  // TODO: move outside of the component (as well as the one above)
  const getPostMtypes = (pretype, postlayer) => {
    if (!pathwayIndex || !pretype || !postlayer) return [];

    return chunk(pathwayIndex.pathways, 2)
      .filter(([preMtypeIdx]) => pathwayIndex.mtypeIdx[preMtypeIdx] === pretype)
      .map(([, postMtypeIdx]) => pathwayIndex.mtypeIdx[postMtypeIdx])
      .filter(onlyUnique)
      .filter(mtype => mtype.match(postlayer))
      .sort()
  };

  const postMtypes = getPostMtypes(pretype, postlayer);

  const pathway = pretype && posttype
    ? `${pretype}-${posttype}`
    : null;

  useEffect(() => {
    fetch(pathwayIndexPath)
      .then(res => res.json())
      .then(pathwayIndex => setPathwayIndex(pathwayIndex));
  }, []);

  useEffect(() => {
    setConnViewerReady(false);
  }, [pretype, posttype]);

  return (
    <>
      <Filters hasData={!!pretype && !!posttype}>
        <Row
          className="w-100"
          gutter={[0,20]}
        >
          <Col
            className="mb-2"
            xs={24}
            lg={12}
          >
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Synaptic Pathways"
                subtitle="Digital Reconstructions"
              />
              <div role="information">
                <InfoBox>
                  <p className="text-tmp">
                    Vivamus vel semper nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                    per inceptos himenaeos. Vivamus ipsum enim, fermentum quis ipsum nec, euismod convallis leo. <br/>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    Sed vel scelerisque felis, quis condimentum felis. Pellentesque dictum neque vel mauris dignissim,
                    vitae ornare arcu sagittis. <br/>
                    Etiam vestibulum, nisi in scelerisque porta, enim est gravida mi,
                    nec pulvinar enim ligula non lorem. Aliquam ut orci est.
                    Praesent tempus sollicitudin ante varius feugiat.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </Col>
          <Col
            className={`set-accent-color--${'grey'} mb-2`}
            xs={24}
            lg={12}
          >
            <div className={`${selectorStyle.head} ${selectorStyle.fullHeader}`}>1. Select a pre-synaptic layer and M-type</div>
            <div className={selectorStyle.row}>
              <div className={selectorStyle.column}>
                <div className={selectorStyle.body}>
                  <LayerSelector value={prelayer as Layer} onSelect={setPreLayerQuery} />
                </div>
              </div>
              <div className={selectorStyle.column}>
                <div className={selectorStyle.body}>
                  <List
                    block
                    title="M-type pre-synaptic"
                    list={preMtypes}
                    value={pretype}
                    color={colorName}
                    onSelect={setPreTypeQuery}
                  />
                </div>
              </div>
            </div>
            <div className={`${selectorStyle.head} ${selectorStyle.fullHeader}`}>2. Select a post-synaptic layer and M-type</div>
            <div className={selectorStyle.row}>
              <div className={selectorStyle.column}>
                <div className={selectorStyle.body}>
                  <LayerSelector value={postlayer as Layer} onSelect={setPostLayerQuery} />
                </div>
              </div>
              <div className={selectorStyle.column}>
                <div className={selectorStyle.body}>
                  <List
                    block
                    title="M-type post-synaptic"
                    list={postMtypes}
                    value={posttype}
                    color={colorName}
                    onSelect={setPostTypeQuery}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer
        visible={!!pretype && !!posttype}
        navItems={[
          { id: 'pathwaySection', label: 'Pathway' },
          { id: 'synaptomesSection', label: 'Synaptomes' },
          { id: 'simulationsSection', label: 'Simulations' },
        ]}
      >
        <Collapsible
          id="pathwaySection"
          title="Pathway <X>-<Y>"
        >
          <h3 className="text-tmp">Pathway factsheet</h3>
          <h3 className="text-tmp">Synaptic anatomy&physiology distribution plots</h3>
          <h3 className="text-tmp">Exemplar connection</h3>

          <HttpData path={connectionViewerDataPath(pretype, posttype)}>
            {(data, loading) => (
              <div className="mt-3">
                <h3>Exemplar connection 3D viewer: {pretype} - {posttype}</h3>
                <Spin spinning={!connViewerReady}>
                  <ConnectionViewer data={data} onReady={() => setConnViewerReady(true)} />
                </Spin>
              </div>
            )}
          </HttpData>
        </Collapsible>

        <Collapsible
          id="synaptomesSection"
          title="Synaptomes"
          className="mt-4"
        >
          <h3 className="text-tmp">Text</h3>
          <h3 className="text-tmp">Pre-synaptic Synaptome plots + render</h3>
          <h3 className="text-tmp">Post-synaptic Synaptome plots + render</h3>
        </Collapsible>

        <Collapsible
          id="simulationsSection"
          title="Simulations"
          className="mt-4"
        >
          <h3 className="text-tmp">Text + images/videos? + links to the pair recording app</h3>
        </Collapsible>
      </DataContainer>
    </>
  );
};


export default SynapticPathwaysView;
