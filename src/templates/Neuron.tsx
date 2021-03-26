import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Tabs } from 'antd';
import { useNexusContext } from '@bbp/react-nexus';
import range from 'lodash/range';
import get from 'lodash/get';

import { etypeFactsheetPath, metypeFactsheetPath } from '../queries/http';
import ServerSideContext from '../context/server-side-context';
import Title from '../components/Title';
import InfoBox from '../components/InfoBox';
import { lorem } from '../views/Styleguide';
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
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext?.query, ...router?.query };

  const [memodelIndex, setMemodelIndex] = useState<any>(null);
  const [memodelNumberExceptions, setMemodelNumberExceptions] = useState<any>(null);

  const currentRegion: BrainRegion = query.brain_region as BrainRegion;
  const currentLayer: Layer = query.layer as Layer;
  const currentEtype: string = query.etype as string;
  const currentMtype: string = query.mtype as string;
  const currentInstance: string = query.instance as string;

  const setParams = (params: Record<string, string>): void => {
    const query = {
      ...{
        brain_region: currentRegion,
        layer: currentLayer,
        etype: currentEtype,
        mtype: currentMtype,
        instance: currentInstance,
      },
      ...params,
    };
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setRegion = (region: BrainRegion) => {
    setParams({
      'brain_region': region,
      mtype: null,
      etype: null,
      instance: null,
    });
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

  const mtypes = currentLayer && memodelIndex
    ? Object.keys(memodelIndex[currentRegion])
      .filter(mtype => currentLayer.match(/\d+/)[0].includes(mtype.match(/\d+/)[0]))
    : [];

  const etypes = currentMtype && memodelIndex
    ? memodelIndex[currentRegion][currentMtype]
    : [];

  const memodelInstanceRange = () => {
    return range(1, );
  }

  const instances = currentEtype && memodelIndex
    ? range(1, get(memodelNumberExceptions, `${currentMtype}.${currentEtype}.${currentRegion}`, 5) + 1)
      .map(idx => `${currentMtype}_${currentEtype}_${idx}`)
    : [];

  const getMorphologyDistribution = (morphologyResource: any) => {
    return morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i));
  };

  const memodelArchiveHref = [
    basePath,
    '/data/memodel_archives',
    encodeURIComponent(currentMtype),
    encodeURIComponent(currentEtype),
    encodeURIComponent(currentRegion),
    `${currentInstance}.tar.xz`
  ].join('/');

  useEffect(() => {
    if (memodelIndex) return;

    fetch(`${basePath}/data/memodel-number-exceptions.json`)
      .then(res => res.json())
      .then(memodelNumberExceptions => setMemodelNumberExceptions(memodelNumberExceptions))
      .then(() => fetch(`${basePath}/data/memodel-index.json`))
      .then(res => res.json())
      .then(memodelIndex => setMemodelIndex(memodelIndex));
  }, []);

  return (
    <>
      <Filters primaryColor={color} hasData={!!currentInstance}>
        <div className="center-col">
          <Title
            primaryColor={color}
            title="Neurons"
            subtitle={sectionTitle}
            hint="Select a subregion of interest in the S1 of the rat brain."
          />
          <div>
            <InfoBox
              text="We labeled single neurons with biocytin to stain their axonal and dendritic morphologies to enable their 3D reconstruction and their objective classification into morphological types (m-types). In addition, we also characterized the electrical firing patterns of these neurons to different intensities of step currents injected in the soma to group their response into electrical types (e-types). We then mapped the e-types expressed in each m-type to account for the observed diversity of morpho-electrical subtypes (me-types)."
              color={color}
            />
            <br />
            <Pills
              title="1. Select a subregion"
              list={['S1DZ', 'S1DZO', 'S1FL', 'S1HL', 'S1J', 'S1Sh', 'S1Tr', 'S1ULp']}
              defaultValue={currentRegion}
              onSelect={setRegion as (s: string) => void}
              color={color}
            />
          </div>
        </div>
        <div className="center-col">
          <ComboSelector
            selector={
              <MicrocircuitSelector
                color={accentColors[color]}
                defaultActiveLayer={currentLayer}
                onLayerSelected={setLayer}
                disabled={!currentRegion}
              />
            }
            list1={
              <List
                title="m-type"
                list={mtypes}
                value={currentMtype}
                onSelect={setMtype}
                color={color}
              />
            }
            list2={
              <List
                title="e-type"
                list={etypes}
                value={currentEtype}
                onSelect={setEtype}
                color="orange"
              />
            }
            list3={
              <List
                title="me-type instance"
                block
                list={instances}
                value={currentInstance}
                onSelect={setInstance}
                color="orange"
              />
            }
            selectorTitle="2. Choose a layer"
            listsTitle="3. Choose mtype, etype and neuron instance"
            list1Open={!!currentLayer}
            list2Open={!!currentMtype}
            list3Open={!!currentMtype && !!currentEtype}
          />
        </div>
      </Filters>

      <DataContainer>
        {currentMtype && (
          <HttpData path={`${basePath}/data/MTypes/L5_BTC/factsheet.json`}>
            {data => (
              <Collapsible title={`M-Type ${currentMtype} Factsheet`}>
                <MtypeFactsheet data={data} />
                <MorphHistogram className="mt-4" region={currentRegion} mtype={currentMtype} />
              </Collapsible>
            )}
          </HttpData>
        )}

        {currentInstance && (
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
        )}

        {currentInstance && (
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

                  {/* {data && (
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
                  )} */}


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
        )}
      </DataContainer>
    </>
  );
};

export default Neurons;
