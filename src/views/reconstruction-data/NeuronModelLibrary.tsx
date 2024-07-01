import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Spin } from 'antd';
import { Row, Col } from 'antd'; // Import Row and Col from antd

import { etypeFactsheetPath } from '@/queries/http';
import Title from '@/components/Title';
import LayerSelector from '@/components/LayerSelector';
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
// import NeuronMorphology from '@/components/NeuronMorphology';
import { basePath } from '@/config';
import models from '@/models.json';
import { defaultSelection, layers } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';
import { colorName } from './config';

import styles from '../../styles/digital-reconstructions/neurons.module.scss';

const modelMorphologyRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_(.+)\_[a-zA-Z0-9]+$/;

const getMtypes = (layer) => {
  return layer
    ? models
      .filter(model => model.layer === layer)
      .map(model => model.mtype)
      .reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];
}

const getEtypes = (mtype) => {
  return mtype
    ? models
      .filter(model => model.mtype === mtype)
      .map(model => model.etype)
      .reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];
}

const getInstances = (mtype, etype) => {
  return etype
    ? models
      .filter(model => model.mtype === mtype && model.etype === etype)
      .map(model => model.name)
      .sort()
    : [];
}

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

  const mtypes = getMtypes(currentLayer);
  const etypes = getEtypes(currentMtype);
  const instances = getInstances(currentMtype, currentEtype);

  const getMorphologyDistribution = (morphologyResource: any) => {
    return morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i));
  };

  const memodelArchiveHref = `https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/hippocampus_optimization/rat/CA1/v4.0.5/optimizations_Python3/${currentInstance}/${currentInstance}.zip?bluenaas=true`;

  const morphologyName = currentInstance
    ? currentInstance.match(modelMorphologyRe)[1]
    : null;

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <Row className="w-100" gutter={[0, 20]}>
          <Col className="mb-2" xs={24} lg={12}>
            <Title
              primaryColor={colorName}
              title="Neuron model library"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <div role="information">
              <InfoBox>
                <p>
                  Initial set of single <Link className={"link theme-" + theme} href="/reconstruction-data/neuron-models">cell models</Link> are combined with the <Link className={"link theme-" + theme} href={"/experimental-data/neuronal-morphology/"}>morphology library</Link> to produce a library of neuron models.
                </p>
              </InfoBox>
            </div>
            <div className="selector">
              <div className={"selector__column theme-" + theme}>
                <div className={"selector__head theme-" + theme}>Choose a layer</div>
                <div className={"selector__selector-container"}>
                  <LayerSelector3D
                    value={currentLayer}
                    onSelect={setLayer}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={"selector__column theme-" + theme}>
                <div className={"selector__head theme-" + theme}>Select reconstruction</div>
                <div className={"selector__body"}>
                  <List
                    block
                    list={mtypes}
                    value={currentMtype}
                    title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                    color={colorName}
                    onSelect={setMtype}
                    theme={theme}
                  />
                  <List
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
            </div>
          </Col>
        </Row>
      </Filters>
      <DataContainer navItems={[]}>
        <Collapsible id="tbd" title="TBD">
          <h3 className="text-tmp">Text description</h3>
        </Collapsible>
      </DataContainer>
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