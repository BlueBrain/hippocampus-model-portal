import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { Button } from 'antd';

import { etypeFactsheetPath } from '../../queries/http';
import Title from '../../components/Title';
import LayerSelector from '../../components/LayerSelector';
import InfoBox from '../../components/InfoBox';
import Filters from '../../layouts/Filters';
import HttpData from '../../components/HttpData';
import DataContainer from '../../components/DataContainer';
import { Layer } from '../../types';
import List from '../../components/List';
import Collapsible from '../../components/Collapsible';
import EtypeFactsheet from '../../components/EtypeFactsheet';
import ModelMorphologyFactsheet from '../../components/ModelMorphologyFactsheet';
import NeuronMorphology from '../../components/NeuronMorphology';
import { basePath } from '../../config';
import models from '../../models.json';
import { defaultSelection } from '@/constants';
import withPreselection from '@/hoc/with-preselection';

import styles from '../../styles/digital-reconstructions/neurons.module.scss';


const modelMorphologyRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_(.+)\_[a-zA-Z0-9]+$/;


const Neurons: React.FC = () => {
  const router = useRouter();

  const query = {
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
      .reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];

  const etypes = currentMtype
    ? models
      .filter(model => model.mtype === currentMtype)
      .map(model => model.etype)
      .reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], [])
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

  const memodelArchiveHref = `https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/hippocampus_optimization/rat/CA1/v4.0.5/optimizations_Python3/${currentInstance}/${currentInstance}.zip?bluenaas=true`;

  const morphologyName = currentInstance
    ? currentInstance.match(modelMorphologyRe)[1]
    : null;

  return (
    <>
      <Filters>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor="grey-1"
              title={<span>Neurons</span>}
              subtitle="Digital Reconstructions"
            />
            <InfoBox
              color="grey-1"
            >
              <p>
                We reconstructed the 3D morphology of single neurons and classified them into
                morphological types (m-types). In addition, we recorded electrical traces from the same cell types
                and classified the traces into electrical types (e-types). Finally, we mapped the e-types
                expressed in each m-type to account for the observed diversity
                of morpho-electrical subtypes (me-types).
              </p>
            </InfoBox>
          </div>
          <div className="col-xs-12 col-lg-6">
            <div className={styles.selector}>
              <div className={styles.selectorColumn}>
                <div className={styles.selectorHead}>1. Choose a layer</div>
                <div className={styles.selectorBody}>
                  <LayerSelector
                    value={currentLayer}
                    onSelect={setLayer}
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
                    title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                    color="grey-1"
                    onSelect={setMtype}
                  />
                  <List
                    className="mb-2"
                    list={etypes}
                    value={currentEtype}
                    title={`E-type ${etypes.length ? '(' + etypes.length + ')' : ''}`}
                    color="grey-1"
                    onSelect={setEtype}
                  />
                  <List
                    list={instances}
                    value={currentInstance}
                    title={`ME-type instance ${instances.length ? '(' + instances.length + ')' : ''}`}
                    color="grey-1"
                    onSelect={setInstance}
                    anchor="data"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        visible={!!currentInstance}
        navItems={[
          { id: 'modelInstance', label: 'Instance' },
          { id: 'mtypeSection', label: 'M-Type' },
          { id: 'etypeSection', label: 'E-Type' },
        ]}
      >
        <Collapsible
          id="modelInstance"
          className="mt-4"
          title={`Model instance ${currentInstance} Factsheet`}
        >
          <h3>Anatomy</h3>
          <ModelMorphologyFactsheet morphologyName={morphologyName} />

          <div className="row end-xs mt-3 mb-4">
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

          <h3 className="mb-3">Morphology</h3>
          <NeuronMorphology path={`${basePath}/data/model-morphologies-swc/${morphologyName}.swc`} />
          <div className="row end-xs mt-3 mb-3">
            <div className="col">
              <Button
                type="primary"
                download
                href={`${basePath}/data/model-morphologies-asc/${morphologyName}.asc`}
              >
                Download morphology
              </Button>
            </div>
          </div>

          <h3 className="text-tmp">Table: experimental morphologies used for this model</h3>

          <h3 className="text-tmp">EPSP and bAP attenuation videos?</h3>
        </Collapsible>

        <Collapsible
          id="mtypeSection"
          className="mt-4"
          title="M-Type <X>"
        >
          <h3 className="text-tmp">Text?</h3>
          <h3 className="text-tmp">M-type population factsheet</h3>
          <h3 className="text-tmp">M-type population distribution plots</h3>
        </Collapsible>

        <Collapsible
          id="etypeSection"
          className="mt-4"
          title={`E-Type ${currentEtype} Factsheet`}
        >
          <HttpData path={etypeFactsheetPath(currentInstance)}>
            {data => (
              <>
                <h3 className="text-tmp">Text?</h3>
                <EtypeFactsheet data={data} />
                <div className="text-right mt-3 mb-3">
                  <Button
                    type="primary"
                    href={etypeFactsheetPath(currentInstance)}
                    download
                  >
                    Download factsheet
                  </Button>
                </div>
                <h3 className="text-tmp">List of experimental traces used for model fitting (with trace viewer) ?</h3>
              </>
            )}
          </HttpData>
          {/* TODO: add experimental traces used for model fitting */}
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default withPreselection(
  Neurons,
  {
    key: 'layer',
    defaultQuery: defaultSelection.digitalReconstruction.neurons,
  },
);
