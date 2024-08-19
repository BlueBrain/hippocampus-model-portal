import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Spin } from 'antd';

import { etypeFactsheetPath } from '@/queries/http';
import Title from '@/components/Title';
import LayerSelector3D from '@/components/LayerSelector3D/index';
import InfoBox from '@/components/InfoBox';
import Filters from '@/layouts/Filters';
import HttpData from '@/components/HttpData';
import DataContainer from '@/components/DataContainer';
import { Layer } from '@/types';
import List from '@/components/List';
import Collapsible from '@/components/Collapsible';
import EtypeFactsheet from '@/components/EtypeFactsheet';
import ModelMorphologyFactsheet from '@/components/ModelMorphologyFactsheet';
import { basePath } from '@/config';
import models from '@/models.json';
import { defaultSelection, layers } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';
import { colorName } from './config';

import StickyContainer from '@/components/StickyContainer';

const modelMorphologyRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_(.+)\_[a-zA-Z0-9]+$/;

const getMtypes = (layer: Layer) => {
  return layer
    ? models
      .filter(model => model.layer === layer)
      .map(model => model.mtype)
      .reduce<string[]>((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];
};

const getEtypes = (mtype: string) => {
  return mtype
    ? models
      .filter(model => model.mtype === mtype)
      .map(model => model.etype)
      .reduce<string[]>((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];
};

const getInstances = (mtype: string, etype: string) => {
  return etype
    ? models
      .filter(model => model.mtype === mtype && model.etype === etype)
      .map(model => model.name)
      .sort()
    : [];
};

const Neurons: React.FC = () => {
  const router = useRouter();

  const theme = 3;

  const { query } = router;

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
      mtype: '',
      etype: '',
      instance: '',
    });
  };
  const setMtype = (mtype: string) => {
    setParams({
      mtype,
      etype: '',
      instance: '',
    });
  };
  const setEtype = (etype: string) => {
    setParams({
      etype,
      instance: '',
    });
  };
  const setInstance = (instance: string) => {
    setParams({ instance });
  };

  const mtypes = getMtypes(currentLayer);
  const etypes = getEtypes(currentMtype);
  const instances = getInstances(currentMtype, currentEtype);

  const getMorphologyDistribution = (morphologyResource: any) => {
    return morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i));
  };

  const memodelArchiveHref = `https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/hippocampus_optimization/rat/CA1/v4.0.5/optimizations_Python3/${currentInstance}/${currentInstance}.zip?bluenaas=true`;

  const morphologyName = currentInstance
    ? currentInstance.match(modelMorphologyRe)?.[1] ?? ''
    : '';

  return (
    <>

      <Filters theme={theme} hasData={!!currentInstance}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Neurons"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div className='w-full' role="information">
                <InfoBox>
                  <p>
                    We used the <Link className={`link theme-${theme}`} href={'/reconstruction-data/neuron-model-library/'}>single neuron library</Link> to populate the network model. The neuron models that find their way into the circuit represent a subset of the entire initial library.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none">
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Select reconstruction</div>
              <div className="selector__body">
                <List
                  className="mb-2"
                  block
                  list={mtypes}
                  value={currentMtype}
                  title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                  color={colorName}
                  onSelect={setMtype}
                  theme={theme}
                />
                <List
                  className="mb-2"
                  block
                  list={etypes}
                  value={currentEtype}
                  title={`E-type ${etypes.length ? '(' + etypes.length + ')' : ''}`}
                  color={colorName}
                  onSelect={setEtype}
                  theme={theme}
                />
                <List
                  block
                  list={instances}
                  value={currentInstance}
                  title={`ME-type instance ${instances.length ? '(' + instances.length + ')' : ''}`}
                  color={colorName}
                  onSelect={setInstance}
                  anchor="data"
                  theme={theme}
                />
              </div>
            </div>
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Choose a layer</div>
              <div className="selector__body">
                <LayerSelector3D
                  value={currentLayer}
                  onSelect={setLayer}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer theme={theme}
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
          <h3 className="text-tmp">Text?</h3>

          <HttpData path={etypeFactsheetPath(currentInstance)}>
            {(data, loading) => (
              <Spin spinning={loading}>
                {data && (
                  <EtypeFactsheet data={data} />
                )}
              </Spin>
            )}
          </HttpData>

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
        </Collapsible>
      </DataContainer >
    </>
  );
};

const hocPreselection = withPreselection(
  Neurons,
  {
    key: 'layer',
    defaultQuery: defaultSelection.digitalReconstruction.neurons,
  },
);

const qsEntries = [
  {
    title: 'Layer',
    key: 'layer',
    values: layers,
  },
  {
    title: 'M-type',
    key: 'mtype',
    getValuesFn: getMtypes,
    getValuesParam: 'layer',
    paramsToKeepOnChange: ['layer'],
  },
  {
    title: 'E-Type',
    key: 'etype',
    getValuesFn: getEtypes,
    getValuesParam: 'mtype',
    paramsToKeepOnChange: ['layer', 'mtype'],
  },
  {
    title: 'Instance',
    key: 'instance',
    getValuesFn: getInstances,
    getValuesParam: ['mtype', 'etype'],
    paramsToKeepOnChange: ['layer', 'mtype', 'etype'],
  },
];

export default withQuickSelector(
  hocPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);