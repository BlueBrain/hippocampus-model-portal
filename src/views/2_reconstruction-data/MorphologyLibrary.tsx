import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';
import LayerSelector3D from '@/components/LayerSelector3D';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import HttpData from '@/components/HttpData';
import { basePath } from '@/config';
import { defaultSelection, layers } from '@/constants';
import models from '@/models.json';
import withPreselection from '@/hoc/with-preselection';
import { colorName } from './config';
import NeuronFactsheet from '../1_experimental-data/neuronal-morphology/NeuronFactsheet';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { downloadAsJson } from '@/utils';

const MorphologyLibrary: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({
    layer: '',
    mtype: '',
    etype: '',
    instance: '',
  });

  const theme = 2;

  useEffect(() => {
    if (!router.isReady) return;

    if (!query.layer && !query.mtype && !query.etype && !query.instance) {
      const defaultQuery = defaultSelection.digitalReconstruction.neurons;
      setQuickSelection(defaultQuery);
      router.replace({ query: defaultQuery }, undefined, { shallow: true });
    } else {
      setQuickSelection({
        layer: query.layer as string,
        mtype: query.mtype as string,
        etype: query.etype as string,
        instance: query.instance as string,
      });
    }
  }, [router.isReady, query]);

  const setParams = (params: Record<string, string>): void => {
    const newQuery = { ...router.query, ...params };
    router.push({ query: newQuery }, undefined, { shallow: true });
  };

  const getMtypes = (layer: string) => {
    return layer
      ? Array.from(new Set(models.filter(m => m.layer === layer).map(m => m.mtype))).sort()
      : [];
  };

  const getEtypes = (mtype: string) => {
    return mtype
      ? Array.from(new Set(models.filter(m => m.mtype === mtype).map(m => m.etype))).sort()
      : [];
  };

  const getInstances = (mtype: string, etype: string) => {
    return etype
      ? models.filter(m => m.mtype === mtype && m.etype === etype).map(m => m.name).sort()
      : [];
  };

  const setLayerQuery = (layer: string) => {
    setQuickSelection(prev => {
      const newMtypes = getMtypes(layer);
      const newMtype = newMtypes.length > 0 ? newMtypes[0] : '';
      const newEtypes = getEtypes(newMtype);
      const newEtype = newEtypes.length > 0 ? newEtypes[0] : '';
      const newInstances = getInstances(newMtype, newEtype);
      const newInstance = newInstances.length > 0 ? newInstances[0] : '';

      const updatedSelection = { layer, mtype: newMtype, etype: newEtype, instance: newInstance };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setMtypeQuery = (mtype: string) => {
    setQuickSelection(prev => {
      const newEtypes = getEtypes(mtype);
      const newEtype = newEtypes.length > 0 ? newEtypes[0] : '';
      const newInstances = getInstances(mtype, newEtype);
      const newInstance = newInstances.length > 0 ? newInstances[0] : '';

      const updatedSelection = { ...prev, mtype, etype: newEtype, instance: newInstance };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setEtypeQuery = (etype: string) => {
    setQuickSelection(prev => {
      const newInstances = getInstances(prev.mtype, etype);
      const newInstance = newInstances.length > 0 ? newInstances[0] : '';

      const updatedSelection = { ...prev, etype, instance: newInstance };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setInstanceQuery = (instance: string) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, instance };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const mtypes = getMtypes(quickSelection.layer);
  const etypes = getEtypes(quickSelection.mtype);
  const instances = getInstances(quickSelection.mtype, quickSelection.etype);

  const qsEntries = [
    {
      title: 'Layer',
      key: 'layer',
      values: layers,
      setFn: setLayerQuery,
    },
    {
      title: 'M-type',
      key: 'mtype',
      values: mtypes,
      setFn: setMtypeQuery,
    },
    {
      title: 'E-type',
      key: 'etype',
      values: etypes,
      setFn: setEtypeQuery,
    },
    {
      title: 'Instance',
      key: 'instance',
      values: instances,
      setFn: setInstanceQuery,
    },
  ];

  return (
    <>
      <Filters theme={theme} >
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Morphology library"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div className='w-full' role="information">
                <InfoBox>
                  <p>
                    We scale and clone <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphologies</Link> to produce a morphology library.
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
                  block
                  list={mtypes}
                  value={quickSelection.mtype}
                  title={`M-type ${mtypes.length ? `(${mtypes.length})` : ''}`}
                  color={colorName}
                  onSelect={setMtypeQuery}
                  theme={theme}
                />
                <List
                  block
                  list={etypes}
                  value={quickSelection.etype}
                  title={`E-type ${etypes.length ? `(${etypes.length})` : ''}`}
                  color={colorName}
                  onSelect={setEtypeQuery}
                  theme={theme}
                />
                <List
                  block
                  list={instances}
                  value={quickSelection.instance}
                  title={`ME-type instance ${instances.length ? `(${instances.length})` : ''}`}
                  color={colorName}
                  onSelect={setInstanceQuery}
                  anchor="data"
                  theme={theme}
                />
              </div>
            </div>
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Choose a layer</div>
              <div className="selector__body grid place-items-center h-full">
                <LayerSelector3D
                  value={quickSelection.layer}
                  onSelect={setLayerQuery}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        visible={!!quickSelection.instance}
        navItems={[
          { id: 'morphologySection', label: 'Neuron Morphology' },
          { id: 'populationSection', label: 'Population' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="morphologySection"
          title="Neuron Morphology"
          properties={[quickSelection.layer, quickSelection.mtype, quickSelection.etype, quickSelection.instance]}
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
            <HttpData path={`${basePath}/resources/data/2_reconstruction-data/morphology-library/mtype/${quickSelection.mtype}/factsheet.json`}>
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