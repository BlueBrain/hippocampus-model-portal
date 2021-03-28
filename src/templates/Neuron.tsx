import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Tabs } from 'antd';
import { useNexusContext } from '@bbp/react-nexus';
import range from 'lodash/range';
import get from 'lodash/get';

import { etypeFactsheetPath, metypeFactsheetPath } from '../queries/http';
import ServerSideContext from '../context/server-side-context';
import Title from '../components/Title';
import LayerSelector from '../components/LayerSelector';
import InfoBox from '../components/InfoBox';
import Filters from '../layouts/Filters';
import Pills from '../components/Pills';
import HttpData from '../components/HttpData';
import DataContainer from '../components/DataContainer';
import { Layer, Color } from '../types';
import { BrainRegion } from '../components/BrainRegionsSelector';
import ComboSelector from '../components/ComboSelector';
import MicrocircuitSelector from '../components/MicrocircuitSelector';
import List from '../components/List';
import { accentColors } from '../config';
import Collapsible from '../components/Collapsible';

import MtypeFactsheet from '../components/MtypeFactsheet';
import EtypeFactsheet from '../components/EtypeFactsheet';
import Factsheet from '../components/Factsheet';
import MorphHistogram from '../components/MorphHistogram';
import ImageViewer from '../components/ImageViewer';
import VideoPlayer from '../components/VideoPlayer';
import NeuronMorphology from '../components/NeuronMorphology';
import ESData from '../components/ESData';
import NexusPlugin from '../components/NexusPlugin';
import NexusFileDownloadButton from '../components/NexusFileDownloadButton';
import { morphologyDataQuery, ephysByNameDataQuery } from '../queries/es';
import { basePath } from '../config';
import models from '../models.json';

import styles from '../../styles/digital-reconstructions/neurons.module.scss';

const { TabPane } = Tabs;


export type NeuronsTemplateProps = {
  color: Color;
  sectionTitle: string;
  factsheetPath: (pathway: string) => string;
  children: (data: any, title: string, pathway: string) => React.ReactNode;
};


const Neurons: React.FC<NeuronsTemplateProps> = ({
  sectionTitle,
  color,
  children,
}) => {
  const router = useRouter();
  const nexus = useNexusContext();
  // const serverSideContext = useContext(ServerSideContext);

  const query = {
    // ...serverSideContext?.query,
    ...router?.query
  };

  const currentLayer: Layer = query.layer as Layer;
  const currentMtype: string = query.mtype as string;
  const currentEtype: string = query.etype as string;
  const currentInstance: string = query.instance as string;

  const setParams = (params: Record<string, string>): void => {
    const query = {
      ...{
        layer: currentLayer,
        mtype: currentMtype,
        etype: currentEtype,
        instance: currentInstance,
      },
      ...params,
    };
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer: Layer) => {
    setParams({
      layer,
      mtype: null,
      etype: null,
      instance: null,
    })
  };
  const setMtype = (mtype: string) => {
    setParams({
      mtype,
      etype: null,
      instance: null,
    })
  };
  const setEtype = (etype: string) => {
    setParams({
      etype,
      instance: null,
    })
  };
  const setInstance = (instance: string) => {
    setParams({ instance })
  };

  const mtypes = currentLayer
    ? models
      .filter(model => model.layer === currentLayer)
      .map(model => model.mtype)
      .reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur],[])
      .sort()
    : [];

  const etypes = currentMtype
    ? models
      .filter(model => model.mtype === currentMtype)
      .map(model => model.etype)
      .reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur],[])
      .sort()
    : [];

  const instances = currentEtype
    ? models
      .filter(model => model.mtype === currentMtype && model.etype === currentEtype)
      .map(model => model.name)
      .sort()
    : [];

  const getMorphologyDistribution = (morphologyResource: any) => {
    return morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i));
  };

  const memodelArchiveHref = [
    basePath,
    '/data/memodel_archives',
    encodeURIComponent(currentMtype),
    encodeURIComponent(currentEtype),
    `${currentInstance}.tar.xz`
  ].join('/');

  return (
    <>
      <Filters color={color} hasData={!!currentInstance}>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor="grey-1"
              title={<span>Neurons</span>}
              subtitle="Digital Reconstructions"
            />
            <InfoBox
              color="grey-1"
              text="We labeled single neurons with biocytin to stain their axonal and dendritic morphologies to enable their 3D reconstruction and their objective classification into morphological types (m-types). In addition, we also characterized the electrical firing patterns of these neurons to different intensities of step currents injected in the soma to group their response into electrical types (e-types). We then mapped the e-types expressed in each m-type to account for the observed diversity of morpho-electrical subtypes (me-types)."
            />
          </div>
          <div className="col-xs-12 col-lg-6">
            <div className={styles.selector}>
              <div className={styles.selectorColumn}>
                <div className={styles.selectorHead}>1. Choose a layer</div>
                <div className={styles.selectorBody}>
                  <LayerSelector
                    activeLayer={currentLayer}
                    onLayerSelected={setLayer}
                  />
                </div>
              </div>
              <div className={styles.selectorColumn}>
                <div className={styles.selectorHead}>2. Select model</div>
                <div className={styles.selectorBody}>
                  <List
                    className="mb-2"
                    list={mtypes}
                    value={currentMtype}
                    title={`M-type ${mtypes.length ? '('+mtypes.length+')' : ''}`}
                    color="grey-1"
                    onSelect={setMtype}
                  />
                  <List
                    className="mb-2"
                    list={etypes}
                    value={currentEtype}
                    title={`E-type ${etypes.length ? '('+etypes.length+')' : ''}`}
                    color="grey-1"
                    onSelect={setEtype}
                  />
                  <List
                    list={instances}
                    value={currentInstance}
                    title={`Model instance ${instances.length ? '('+instances.length+')' : ''}`}
                    color="grey-1"
                    onSelect={setInstance}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer visible={!!currentInstance}>
        {/* {currentMtype && (
          <HttpData path={`${basePath}/data/MTypes/L5_BTC/factsheet.json`}>
            {data => (
              <Collapsible title={`M-Type ${currentMtype} Factsheet`}>
                <MtypeFactsheet data={data} />
                <MorphHistogram className="mt-4" region={currentRegion} mtype={currentMtype} />
              </Collapsible>
            )}
          </HttpData>
        )} */}

        <Collapsible className="mt-4" title={`E-Type ${currentEtype}`}>
          <HttpData path={etypeFactsheetPath(currentInstance)}>
            {data => (
              <EtypeFactsheet data={data} />
            )}
          </HttpData>
        </Collapsible>

        {/* {currentInstance && (
          <HttpData path={etypeFactsheetPath(currentRegion, currentMtype, currentEtype, currentInstance)}>
            {data => (
              <Collapsible className="mt-4" title={`E-Type ${currentEtype} Factsheet`}>
                <EtypeFactsheet data={data} />
                <div className="text-right mt-3 mb-3">
                  <Button
                    type="primary"
                    href={etypeFactsheetPath(currentRegion, currentMtype, currentEtype, currentInstance)}
                    download
                  >
                    Download factsheet
                  </Button>
                </div>

                <h3>Experimental traces used for model fitting</h3>
                <ESData query={ephysByNameDataQuery(data[4].value)}>
                  {esDocuments => (
                    <Tabs type="card" className="mt-3">
                      {esDocuments && esDocuments.map(esDocument => (
                        <TabPane key={esDocument._source.name} tab={esDocument._source.name}>
                          <div style={{ minHeight: '600px' }}>
                            <NexusPlugin
                              name="neuron-electrophysiology"
                              resource={esDocument._source}
                              nexusClient={nexus}
                            />
                          </div>
                        </TabPane>
                      ))}
                    </Tabs>
                  )}
                </ESData>

              </Collapsible>
            )}
          </HttpData>
        )} */}

        {/* {currentInstance && (
          <HttpData path={metypeFactsheetPath(currentRegion, currentMtype, currentEtype, currentInstance)}>
            {data => (
              <>
                <Collapsible className="mt-4" title={`ME-Type Instance ${currentInstance} Factsheet`}>
                  <h3>Anatomy</h3>
                  {data && (
                    <Factsheet facts={data[0].values}/>
                  )}
                  <h3 className="mt-3">Physiology</h3>
                  {data && (
                    <Factsheet facts={data[1].values}/>
                  )}

                  <div className="row end-xs mt-3 mb-3">
                    <div className="col">
                      <Button
                        type="primary"
                        download
                        href={memodelArchiveHref}
                      >
                        Download model
                      </Button>
                    </div>
                  </div>

                  <NeuronMorphology
                    path={`${basePath}/data/memodel_morphologies/${data[2].value}.swc`}
                  />

                  {data && (
                    <ESData
                      query={morphologyDataQuery(currentMtype, data[2].value)}
                    >
                      {esDocuments => (
                        <>
                          {!!esDocuments  && (
                            <NexusFileDownloadButton
                              className="mt-2"
                              filename={getMorphologyDistribution(esDocuments[0]._source).name}
                              url={getMorphologyDistribution(esDocuments[0]._source).contentUrl}
                              org={sscx.org}
                              project={sscx.project}
                            >
                              Download morphology
                            </NexusFileDownloadButton>
                          )}
                          {!!esDocuments && (
                            <NexusPlugin
                              className="mt-3"
                              name="neuron-morphology"
                              resource={esDocuments[0]._source}
                              nexusClient={nexus}
                            />
                          )}
                        </>
                      )}
                    </ESData>
                  )}


                  <div className="row mt-4">
                    <div className="col-xs-12 col-sm-6">
                      <ImageViewer src="https://bbp.epfl.ch/nmc-portal/documents/10184/1921846/cADpyr_dend-C060114A2_axon-C060114A5.png" />
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-xs-12 col-sm-6">
                      <h4 className="mt-4">EPSP Attenuation</h4>
                      <VideoPlayer src="https://bbp.epfl.ch/project/media/nmc-portal/METypes/L5_TTPC1_cADpyr/dend-C060114A2_axon-C060114A5/epsp.mp4" />
                    </div>
                    <div className="col-xs-12 col-sm-6">
                    <h4 className="mt-4">bAP Attenuation</h4>
                      <VideoPlayer src="https://bbp.epfl.ch/project/media/nmc-portal/METypes/L5_TTPC1_cADpyr/dend-C060114A2_axon-C060114A5/bap.mp4" />
                    </div>
                  </div>
                </Collapsible>
              </>
            )}
          </HttpData>
        )} */}
      </DataContainer>
    </>
  );
};

export default Neurons;
