import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import Filters from '@/layouts/Filters';
import DataContainer from '@/components/DataContainer';
import { QuickSelectorEntry } from '@/types';
import List from '@/components/List';
import Collapsible from '@/components/Collapsible';

import { defaultSelection } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import { colorName } from './config';
import HttpData from '@/components/HttpData';
import { dataPath } from '@/config';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import TraceGraph from '../5_predictions/components/Trace';
import Factsheet from '@/components/Factsheet';

import modelsData from './neuron-model.json';
import LayerSelector3D from '@/components/LayerSelector3D';
import MechanismTable from './neuron-model/MechanismTable';
import ExperimentalRecordingsTable from './neuron-model/ExperimentalRecordingsTable';
import EFeature from './neuron-model/EFeature';

const getUniqueValues = (key: string, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string): string[] => {
  return Array.from(new Set(modelsData
    .filter(model =>
      (!filterKey1 || !filterValue1 || model[filterKey1] === filterValue1) &&
      (!filterKey2 || !filterValue2 || model[filterKey2] === filterValue2)
    )
    .map(model => model[key]))).sort();
};

const getFilteredInstances = (layer: string, mtype: string, etype: string): string[] => {
  return modelsData
    .filter(model =>
      (!layer || model.layer === layer) &&
      (!mtype || model.mtype === mtype) &&
      (!etype || model.etype === etype)
    )
    .map(model => model.instance);
};

const Neurons: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentLayer, setCurrentLayer] = useState<string>('');
  const [currentMtype, setCurrentMtype] = useState<string>('');
  const [currentEtype, setCurrentEtype] = useState<string>('');
  const [currentInstance, setCurrentInstance] = useState<string>('');
  const [traceData, setTraceData] = useState<any>(null);
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [experimentalRecordingData, setExperimentalRecordingData] = useState<any>(null);
  const [efeatureData, setEFeatureData] = useState<any>(null);
  const [mechanismsData, setMechanismsData] = useState<any>(null);

  const layers = useMemo(() => getUniqueValues('layer'), []);
  const mtypes = useMemo(() => getUniqueValues('mtype', 'layer', currentLayer), [currentLayer]);
  const etypes = useMemo(() => getUniqueValues('etype', 'layer', currentLayer, 'mtype', currentMtype), [currentLayer, currentMtype]);
  const instances = useMemo(() => getFilteredInstances(currentLayer, currentMtype, currentEtype), [currentLayer, currentMtype, currentEtype]);

  useEffect(() => {
    console.log('Query changed:', query);
    if (Object.keys(query).length === 0) return;

    const newLayer = query.layer && typeof query.layer === 'string' && layers.includes(query.layer)
      ? query.layer
      : layers[0] || '';

    const newMtypes = getUniqueValues('mtype', 'layer', newLayer);
    const newMtype = query.mtype && typeof query.mtype === 'string' && newMtypes.includes(query.mtype)
      ? query.mtype
      : newMtypes[0] || '';

    const newEtypes = getUniqueValues('etype', 'layer', newLayer, 'mtype', newMtype);
    const newEtype = query.etype && typeof query.etype === 'string' && newEtypes.includes(query.etype)
      ? query.etype
      : newEtypes[0] || '';

    const newInstances = getFilteredInstances(newLayer, newMtype, newEtype);
    const newInstance = query.instance && typeof query.instance === 'string' && newInstances.includes(query.instance)
      ? query.instance
      : newInstances[0] || '';

    console.log('Updating states:', { newLayer, newMtype, newEtype, newInstance });
    setCurrentLayer(newLayer);
    setCurrentMtype(newMtype);
    setCurrentEtype(newEtype);
    setCurrentInstance(newInstance);
  }, [query, layers]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentInstance) {
        try {
          const [traceResponse, factsheetResponse, mechanismsResponse, eFeatureResponse, experimentalRecordingResponse] = await Promise.all([
            fetch(`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/trace.json`),
            fetch(`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/features_with_rheobase.json`),
            fetch(`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/mechanisms.json`),
            fetch(`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/efeature.json`),
            fetch(`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/experimental-recordings.json`)
          ]);

          const traceData = await traceResponse.json();
          const factsheetData = await factsheetResponse.json();
          const mechanismsData = await mechanismsResponse.json();
          const eFeatureData = await eFeatureResponse.json();
          const experimentalRecordingData = await experimentalRecordingResponse.json();

          setTraceData(traceData);
          setFactsheetData(factsheetData);
          setMechanismsData(mechanismsData);
          setEFeatureData(eFeatureData);
          setExperimentalRecordingData(experimentalRecordingData)
        } catch (error) {
          console.error('Error fetching data:', error);
          setTraceData(null);
          setFactsheetData(null);
          setMechanismsData(null);
          setEFeatureData(null);
          setExperimentalRecordingData(null)
        }
      }
    };

    fetchData();
  }, [currentInstance]);

  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    console.log('Setting new params:', newQuery);
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer: string) => {
    const newMtypes = getUniqueValues('mtype', 'layer', layer);
    const newMtype = newMtypes[0] || '';
    const newEtypes = getUniqueValues('etype', 'layer', layer, 'mtype', newMtype);
    const newEtype = newEtypes[0] || '';
    const newInstances = getFilteredInstances(layer, newMtype, newEtype);
    const newInstance = newInstances[0] || '';

    setParams({
      layer,
      mtype: newMtype,
      etype: newEtype,
      instance: newInstance,
    });
  };

  const setMtype = (mtype: string) => {
    const newEtypes = getUniqueValues('etype', 'layer', currentLayer, 'mtype', mtype);
    const newEtype = newEtypes[0] || '';
    const newInstances = getFilteredInstances(currentLayer, mtype, newEtype);
    const newInstance = newInstances[0] || '';

    setParams({
      mtype,
      etype: newEtype,
      instance: newInstance,
    });
  };

  const setEtype = (etype: string) => {
    const newInstances = getFilteredInstances(currentLayer, currentMtype, etype);
    const newInstance = newInstances[0] || '';

    setParams({
      etype,
      instance: newInstance,
    });
  };

  const setInstance = (instance: string) => {
    setParams({
      instance,
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Layer',
      key: 'layer',
      values: layers,
      setFn: setLayer,
    },
    {
      title: 'M-Type',
      key: 'mtype',
      values: mtypes,
      setFn: setMtype,
    },
    {
      title: 'E-Type',
      key: 'etype',
      values: etypes,
      setFn: setEtype,
    },
    {
      title: 'Instance',
      key: 'instance',
      values: instances,
      setFn: setInstance,
    },
  ];

  console.log('Current states:', { currentLayer, currentMtype, currentEtype, currentInstance });

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              primaryColor={colorName}
              title="Neuron models"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                Starting from a subset of <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphological reconstructions</Link>, we develop an initial set of single cell models by optimizing model parameters against a set of features extracted from <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-electrophysiology/">electrophysiological recordings</Link>.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
            <div className="selector">
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>Choose a layer</div>
                <div className="selector__selector-container">
                  <LayerSelector3D
                    value={currentLayer}
                    onSelect={setLayer}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>Select reconstruction</div>
                <div className="selector__body">
                  <List
                    block
                    list={mtypes}
                    value={currentMtype}
                    title={`M-type ${mtypes.length ? `(${mtypes.length})` : ''}`}
                    color={colorName}
                    onSelect={setMtype}
                    theme={theme}
                  />
                  <List
                    block
                    list={etypes}
                    value={currentEtype}
                    title={`E-type ${etypes.length ? `(${etypes.length})` : ''}`}
                    color={colorName}
                    onSelect={setEtype}
                    theme={theme}
                  />
                  <List
                    block
                    list={instances}
                    value={currentInstance}
                    title={`Instance ${instances.length ? `(${instances.length})` : ''}`}
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
        navItems={[
          { id: 'traceSection', label: 'Trace' },
          { id: 'bPAPPSPSection', label: 'bPAP & PSP' },
          { id: 'factsheetSection', label: 'Factsheet' },
          { id: 'experimentalRecordingsSection', label: 'Experimental recordings' },
          { id: 'efeaturesSection', label: 'E-features' },
          { id: 'mechansimsSection', label: 'Mechanisms' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible id="traceSection" className="mt-4" title="Trace">
          <div className="graph">
            {traceData && <TraceGraph plotData={traceData} />}
          </div>

          {traceData && (
            <div className="mt-4">
              <DownloadButton onClick={() => downloadAsJson(traceData, `${currentLayer}-${currentMtype}-${currentEtype}-${currentInstance}-trace.json`)} theme={theme}>
                Trace data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        <Collapsible id="bPAPPSPSection" className="mt-4" title="bPAP & PSP">
          <div className="graph">
            {/* Add bPAP & PSP graph component here */}
          </div>
        </Collapsible>

        <Collapsible id="factsheetSection" className="mt-4" title="Factsheet">
          {factsheetData && (
            <>
              <Factsheet facts={factsheetData} />
              <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(factsheetData, `${currentLayer}-${currentMtype}-${currentEtype}-${currentInstance}-factsheet.json`)} theme={theme}>
                  Factsheet
                </DownloadButton>
              </div>
            </>
          )}
        </Collapsible>

        <Collapsible id="experimentalRecordingsSection" className="mt-4" title="Experimental recordings">
          {experimentalRecordingData && (
            <ExperimentalRecordingsTable data={experimentalRecordingData} />
          )}
        </Collapsible>

        <Collapsible id="efeaturesSection" className="mt-4" title="E-features">
          {efeatureData && (
            <>
              <EFeature data={efeatureData} />
              <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(factsheetData, `${currentLayer}-${currentMtype}-${currentEtype}-${currentInstance}-factsheet.json`)} theme={theme}>
                  Factsheet
                </DownloadButton>
              </div>
            </>
          )}
        </Collapsible>

        <Collapsible id="mechansimsSection" className="mt-4" title="Mechanisms">
          {mechanismsData && (
            <MechanismTable data={mechanismsData} instance={currentInstance} />
          )}
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