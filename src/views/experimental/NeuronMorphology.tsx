import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';

import ServerSideContext from '../../context/server-side-context';
import ESData from '../../components/ESData';
import HttpData from '../../components/HttpData';
import DataContainer from '../../components/DataContainer';
import LayerSelector from '../../components/LayerSelector';
import ImageViewer from '../../components/ImageViewer';
import { morphologyDataQuery, mtypeExpMorphologyListDataQuery } from '../../queries/es';
import { expMorphologyFactsheetPath } from '../../queries/http';
import Filters from '../../layouts/Filters';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import NexusPlugin from '../../components/NexusPlugin';
import { lorem } from '../Styleguide';
import { colorName } from './config';
import { Layer } from '../../types';
import ComboSelector from '../../components/ComboSelector';
import Collapsible from '../../components/Collapsible';
import List from '../../components/List';
import morphologies from '../../morphologies.json';
import Factsheet from '../../components/Factsheet';
import ExpMorphologyTable from '../../components/ExpMorphologyTable';
import NexusFileDownloadButton from '../../components/NexusFileDownloadButton';
import { hippocampus, basePath } from '../../config';
import styles from '../../../styles/experimental-data/neuron-morphology.module.scss';


const NeuronExperimentalMorphology: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext.query, ...router.query };

  const setQuery = (query: any): void => {
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer: Layer) => {
    setQuery({
      layer,
      mtype: null,
      instance: null,
    });
  };
  const currentLayer: Layer = query.layer as Layer;

  const mtypes =  currentLayer
    ? Array.from(new Set(morphologies.filter(m => m.region === currentLayer).map(m => m.mtype))).sort()
    : [];

  const setMtype = (mtype: string) => {
    setQuery({
      mtype,
      layer: currentLayer,
      instance: null,
    });
  };
  const currentMtype: string = query.mtype as string;

  const instances = currentMtype
    ? morphologies.filter(m => m.mtype === currentMtype).map(m => m.name).sort()
    : []

  const setInstance = (instance: string) => {
    setQuery({
      instance,
      layer: currentLayer,
      mtype: currentMtype,
    });
  };
  const currentInstance: string = query.instance as string;

  const currentInstanceId = currentInstance
    ? morphologies.find(m => m.name === currentInstance).id
    : null;

  const getMorphologyDistribution = (morphologyResource: any) => {
    return morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i));
  };

  const getAndSortMorphologies = (esDocuments) => {
    return esDocuments
      .map(esDocument => esDocument._source)
      .sort((m1, m2) => (m1.name > m2.name) ? 1 : -1);
  };

  return (
    <>
      <Filters color={colorName} backgroundAlt hasData={!!currentInstance}>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-md-6">
            <Title
              primaryColor={colorName}
              title={<span>Neuronal <br/> Morphology</span>}
              subtitle="Experimental Data"
            />
            <InfoBox
              color="grey-1"
              text="Reconstructed neurons are classified into diverse morphological types (m-types). Each m-type has several instances of reconstructed axonal and dendritic morphologies. Using objective classification methods, we have identified 60 m-types in the primary rat Somatosensory Cortex."
            />
          </div>
          <div className="col-xs-12 col-md-6">
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
                <div className={styles.selectorHead}>2. Select reconstruction</div>
                <div className={styles.selectorBody}>
                  <List
                    list={mtypes}
                    value={currentMtype}
                    title="m-type"
                    color={colorName}
                    onSelect={setMtype}
                  />
                  <br/>
                  <br/>
                  <br/>
                  <List
                    list={instances}
                    value={currentInstance}
                    title="Reconstructed morphology"
                    color={colorName}
                    onSelect={setInstance}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-xs-12 col-md-6">
            <div className="row">
              <div className={`col-xs-12 col-sm-6 ${styles.selectorHead}`}>
                1. Choose a layer
              </div>
              <div className={`col-xs-12 col-sm-6 ${styles.selectorHead}`}>
                2. Select reconstruction
              </div>
              <div className={`col-xs-12 col-sm-6 ${styles.selectorBody}`}>
                <LayerSelector
                  activeLayer={currentLayer}
                  onLayerSelected={setLayer}
                />
              </div>
              <div className={`col-xs-12 col-sm-6 ${styles.selectorBody}`}>
                <List
                  list={mtypes}
                  value={currentMtype}
                  title="m-type"
                  color={colorName}
                  onSelect={setMtype}
                />
                <br/>
                <br/>
                <br/>
                <List
                  list={instances}
                  value={currentInstance}
                  title="Reconstructed morphology"
                  color={colorName}
                  onSelect={setInstance}
                />
              </div>
            </div>
          </div> */}
        </div>
      </Filters>

      <DataContainer visible={!!currentInstance}>
        <Collapsible title="Population">
          <h3>Factsheet</h3>
          <p>TBD</p>

          <h3 className="mt-3">Distribution</h3>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <ImageViewer src={`${basePath}/assets/images/population-distribution-1.png`} />
            </div>
            <div className="col-xs-12 col-sm-6">
              <ImageViewer src={`${basePath}/assets/images/population-distribution-2.png`} />
            </div>
          </div>

          {/* <h3 className="mt-3">Reconstructed morphologies</h3>
          <ESData query={mtypeExpMorphologyListDataQuery(currentMtype)}>
            {esDocuments => (
              <>
                {!!esDocuments &&
                  <ExpMorphologyTable
                    morphologies={getAndSortMorphologies(esDocuments)}
                  />
                }
              </>
            )}
          </ESData> */}
        </Collapsible>

        <Collapsible
          className="mt-4 mb-4"
          title={`Neuron Morphology ${currentMtype} ${currentInstance}`}
        >
          {/* <HttpData path={expMorphologyFactsheetPath(currentInstance)}>
            {factsheetData => (
              <Factsheet facts={factsheetData[0].values} />
            )}
          </HttpData> */}

          <ESData
            query={morphologyDataQuery(currentMtype, currentInstance)}
          >
            {esDocuments => (
              <>
                {/* {!!esDocuments && !!esDocuments.length && (
                  <NexusFileDownloadButton
                    className="mt-2"
                    filename={getMorphologyDistribution(esDocuments[0]._source).name}
                    url={getMorphologyDistribution(esDocuments[0]._source).contentUrl}
                    org={hippocampus.org}
                    project={hippocampus.project}
                  >
                    Download morphology
                  </NexusFileDownloadButton>
                )} */}
                {!!esDocuments && !!esDocuments.length && (
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
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default NeuronExperimentalMorphology;
