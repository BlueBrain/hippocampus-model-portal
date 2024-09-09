import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Title from '@/components/Title';
import LayerSelector3D from '@/components/LayerSelector3D/index';
import InfoBox from '@/components/InfoBox';
import Filters from '@/layouts/Filters';
import DataContainer from '@/components/DataContainer';
import { Layer, QuickSelectorEntry } from '@/types';
import List from '@/components/List';
import Collapsible from '@/components/Collapsible';

import models from '@/models.json';
import { defaultSelection, layers } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import { colorName } from './config';
import NeuronFactsheet from '../1_experimental-data/neuronal-morphology/NeuronFactsheet';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import HttpData from '@/components/HttpData';
import { basePath } from '@/config';

// Function to get unique M-types for a given layer
const getMtypes = (layer: Layer): string[] => {
  return layer
    ? models
      .filter(model => model.layer === layer)
      .map(model => model.mtype)
      .reduce((acc: string[], cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];
}

// Function to get unique E-types for a given M-type
const getEtypes = (mtype: string): string[] => {
  return mtype
    ? models
      .filter(model => model.mtype === mtype)
      .map(model => model.etype)
      .reduce((acc: string[], cur) => acc.includes(cur) ? acc : [...acc, cur], [])
      .sort()
    : [];
}

// Function to get unique instances for given M-type and E-type
const getInstances = (mtype: string, etype: string): string[] => {
  return etype
    ? models
      .filter(model => model.mtype === mtype && model.etype === etype)
      .map(model => model.name)
      .sort()
    : [];
}

// React Functional Component
const MorphologyLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const currentLayer: Layer = query.layer as Layer;
  const currentMtype: string = query.mtype as string;
  const currentEtype: string = query.etype as string;
  const currentInstance: string = query.instance as string;

  // Function to set URL parameters
  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...{
        layer: currentLayer,
        mtype: currentMtype,
        etype: currentEtype,
        instance: currentInstance,
      },
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  // Functions to set specific parameters
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

  // Generate options based on current parameters
  const mtypes = getMtypes(currentLayer);
  const etypes = getEtypes(currentMtype);
  const instances = getInstances(currentMtype, currentEtype);

  // Quick selector entries
  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Layer',
      key: 'layer',
      values: layers,
      setFn: setLayer,
    },
    {
      title: 'M-type',
      key: 'mtype',
      getValuesFn: getMtypes,
      setFn: setMtype,
    },
    {
      title: 'E-Type',
      key: 'etype',
      getValuesFn: getEtypes,
      setFn: setEtype,
    },
    {
      title: 'Instance',
      key: 'instance',
      // Wrap the getInstances function to match expected signature
      getValuesFn: (etype: string) => getInstances(currentMtype, etype),
      setFn: setInstance,
    },
  ];
  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Morphology library"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                We scale and clone <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphologies</Link> to produce a morphology library.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
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
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        visible={!!currentInstance}
        navItems={[
          { id: 'morphologySection', label: 'Neuron Morphology' },
          { id: 'populationSection', label: 'Population' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="morphologySection"
          title="Neuron Morphology"
          properties={[currentLayer, currentMtype, currentEtype, currentInstance]}
        >
          <p className='text-lg mb-2'>
            We provide visualization and morphometrics for the selected morphology.
          </p>
        </Collapsible>
        <Collapsible
          id="populationSection"
          title="Population"
        >
          <p className='text-lg mb-2'>
            We provide morphometrics for the entire m-type group selected.
          </p>
          <div className="mb-4">
            <HttpData path={`${basePath}/resources/data/2_reconstruction-data/morphology-library/mtype/${currentEtype}/factsheet.json`}>
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet id="morphometrics" facts={factsheetData.values} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${instances}-factsheet.json`)} theme={theme}>
                          Factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default withPreselection(
  MorphologyLibrary,
  {
    key: 'layer',
    defaultQuery: defaultSelection.digitalReconstruction.neurons,
  },
);


