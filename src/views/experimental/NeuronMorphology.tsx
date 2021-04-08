import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';

import ESData from '../../components/ESData';
import DataContainer from '../../components/DataContainer';
import LayerSelector from '../../components/LayerSelector';
import { morphologyDataQuery, mtypeExpMorphologyListDataQuery } from '../../queries/es';
import Filters from '../../layouts/Filters';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import NexusPlugin from '../../components/NexusPlugin';
import { colorName } from './config';
import { Layer } from '../../types';
import Collapsible from '../../components/Collapsible';
import List from '../../components/List';
import morphologies from '../../exp-morphology-list.json';
import ExpMorphologyFactsheet from '../../components/ExpMorphologyFactsheet';
import ExpMorphologyTable from '../../components/ExpMorphologyTable';
import NexusFileDownloadButton from '../../components/NexusFileDownloadButton';
import { hippocampus } from '../../config';

import styles from '../../styles/experimental-data/neuron-morphology.module.scss';


const NeuronExperimentalMorphology: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const query = {
    ...router.query
  };

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

  const mtypes = currentLayer
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
      <Filters backgroundAlt>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor={colorName}
              title={<span>Neuronal <br /> Morphology</span>}
              subtitle="Experimental Data"
            />
            <InfoBox
              color="grey-1"
              text="We classified neuronal morphologies in different morphological types (m-types) and created digital 3D reconstructions. Using objective classification methods, we have identified 12 m-types in rat hippocampus CA1."
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
                <div className={styles.selectorHead}>2. Select reconstruction</div>
                <div className={styles.selectorBody}>
                  <List
                    list={mtypes}
                    value={currentMtype}
                    title="m-type"
                    color={colorName}
                    onSelect={setMtype}
                  />
                  <br />
                  <br />
                  <br />
                  <List
                    list={instances}
                    value={currentInstance}
                    title="Reconstructed morphology"
                    color={colorName}
                    onSelect={setInstance}
                    anchor="data"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <div id="data" />

      {!!currentInstance && <DataContainer>
        <Collapsible title="Population">
          <h3>Reconstructed morphologies</h3>
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
          </ESData>
        </Collapsible>

        <Collapsible
          className="mt-4 mb-4"
          title={`Neuron Morphology ${currentMtype} ${currentInstance}`}
        >
          <ExpMorphologyFactsheet morphologyName={currentInstance} />

          <ESData
            query={morphologyDataQuery(currentMtype, currentInstance)}
          >
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <div className="text-right">
                    <NexusFileDownloadButton
                      className="mt-2"
                      filename={getMorphologyDistribution(esDocuments[0]._source).name}
                      url={getMorphologyDistribution(esDocuments[0]._source).contentUrl}
                      org={hippocampus.org}
                      project={hippocampus.project}
                    >
                      Download morphology
                    </NexusFileDownloadButton>
                  </div>
                )}
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
      </DataContainer>}
    </>
  );
};

export default NeuronExperimentalMorphology;
