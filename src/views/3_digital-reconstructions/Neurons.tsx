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
import { dataPath } from '@/config';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import TraceGraph from '../5_predictions/components/Trace';
import modelsData from './neurons.json';
import PopulationFactsheet from './acetylcholine/PopulationFactsheet';
import Factsheet from '@/components/Factsheet';
import LayerSelector3D from '@/components/LayerSelector3D';
import { Layer } from '@/types'; // Ensure Layer is imported from the correct path
import ExperimentalMorphologyTable from '@/components/ExperiementalMorphologyUsed';

const getUniqueValues = (key: string, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string, filterKey3?: string, filterValue3?: string): string[] => {
  return Array.from(new Set(modelsData
    .filter(model =>
      (!filterKey1 || !filterValue1 || model[filterKey1] === filterValue1) &&
      (!filterKey2 || !filterValue2 || model[filterKey2] === filterValue2) &&
      (!filterKey3 || !filterValue3 || model[filterKey3] === filterValue3)
    )
    .map(model => model[key]))).sort();
};

const getFilteredMorphologies = (mtype: string, etype: string, layer?: Layer): string[] => {
  return modelsData
    .filter(model =>
      (!mtype || model.mtype === mtype) &&
      (!etype || model.etype === etype) &&
      (!layer || model.layer === layer)
    )
    .map(model => model.morphology);
};

const NeuronsView: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const theme = 3;
  const [currentMtype, setCurrentMtype] = useState<string>('');
  const [currentEtype, setCurrentEtype] = useState<string>('');
  const [currentMorphology, setCurrentMorphology] = useState<string>('');
  const [traceData, setTraceData] = useState<any>(null);
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [experimentalRecordingData, setExperimentalRecordingData] = useState<any>(null);
  const [mechanismsData, setMechanismsData] = useState<any>(null);
  const [currentLayer, setCurrentLayer] = useState<Layer | undefined>(modelsData[0]?.layer as Layer | undefined); // Set default layer

  const mtypes = useMemo(() => getUniqueValues('mtype', 'layer', currentLayer?.toString()), [currentLayer]);
  const etypes = useMemo(() => getUniqueValues('etype', 'mtype', currentMtype, 'layer', currentLayer?.toString()), [currentMtype, currentLayer]);
  const morphologies = useMemo(() => getFilteredMorphologies(currentMtype, currentEtype, currentLayer), [currentMtype, currentEtype, currentLayer]);


  useEffect(() => {
    if (Object.keys(query).length === 0) return;

    const newMtypes = getUniqueValues('mtype', 'layer', currentLayer?.toString());
    const newMtype = query.mtype && typeof query.mtype === 'string' && newMtypes.includes(query.mtype)
      ? query.mtype
      : newMtypes[0] || '';

    const newEtypes = getUniqueValues('etype', 'mtype', newMtype, 'layer', currentLayer?.toString());
    const newEtype = query.etype && typeof query.etype === 'string' && newEtypes.includes(query.etype)
      ? query.etype
      : newEtypes[0] || '';

    const newMorphologies = getFilteredMorphologies(newMtype, newEtype, currentLayer);
    const newMorphology = query.morphology && typeof query.morphology === 'string' && newMorphologies.includes(query.morphology)
      ? query.morphology
      : newMorphologies[0] || '';

    setCurrentMtype(newMtype);
    setCurrentEtype(newEtype);
    setCurrentMorphology(newMorphology);
  }, [query, currentLayer]);

  useEffect(() => {


    const fetchData = async () => {
      if (currentMorphology) {
        try {
          const [traceResponse, factsheetResponse] = await Promise.all([
            fetch(`${dataPath}/3_digital-reconstruction/neuron/${currentMtype}/${currentEtype}/${currentMorphology}/trace.json`),
            fetch(`${dataPath}/3_digital-reconstruction/neuron/${currentMtype}/${currentEtype}/${currentMorphology}/features_with_rheobase.json`),

          ]);

          const traceData = await traceResponse.json();
          const factsheetData = await factsheetResponse.json();


          setTraceData(traceData);
          setFactsheetData(factsheetData);
          setMechanismsData(mechanismsData);
          setExperimentalRecordingData(experimentalRecordingData)
        } catch (error) {
          setTraceData(null);
          setFactsheetData(null);
          setMechanismsData(null);
          setExperimentalRecordingData(null)
        }
      }
    };

    fetchData();
  }, [currentMorphology]);

  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setMtype = (mtype: string) => {
    const newEtypes = getUniqueValues('etype', 'mtype', mtype);
    const newEtype = newEtypes[0] || '';
    const newMorphologies = getFilteredMorphologies(mtype, newEtype);
    const newMorphology = newMorphologies[0] || '';

    setParams({
      mtype,
      etype: newEtype,
      morphology: newMorphology,
    });
  };

  const setEtype = (etype: string) => {
    const newMorphologies = getFilteredMorphologies(currentMtype, etype);
    const newMorphology = newMorphologies[0] || '';

    setParams({
      etype,
      morphology: newMorphology,
    });
  };

  const setMorphology = (morphology: string) => {
    setParams({
      morphology,
    });
  };

  const setLayer = (layer: Layer) => {
    setCurrentLayer(layer);
    const newMtypes = getUniqueValues('mtype', 'layer', layer.toString());
    const newMtype = newMtypes[0] || '';
    const newEtypes = getUniqueValues('etype', 'mtype', newMtype, 'layer', layer.toString());
    const newEtype = newEtypes[0] || '';
    const newMorphologies = getFilteredMorphologies(newMtype, newEtype, layer);
    const newMorphology = newMorphologies[0] || '';

    setParams({
      layer: layer.toString(),
      mtype: newMtype,
      etype: newEtype,
      morphology: newMorphology,
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Layer',
      key: 'layer',
      values: Array.from(new Set(modelsData.map(model => model.layer))),
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
      title: 'Morphology',
      key: 'morphology',
      values: morphologies,
      setFn: setMorphology,
    },
  ];

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Neurons"
              subtitle="Digital Reconstructions"
              theme={theme}
            />
            <InfoBox>
              <p>
                We used the <Link className={`link theme-${theme}`} href={'/reconstruction-data/neuron-model-library/'}>single neuron library</Link> to populate the network model. The neuron models that find their way into the circuit represent a subset of the entire initial library.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
            <div className="selector">
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>
                  Choose a layer
                </div>
                <div className="selector__selector-container">
                  <LayerSelector3D
                    value={currentLayer || undefined}
                    onSelect={setLayer}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>
                  Select reconstruction
                </div>
                <div className="selector__body">
                  <List
                    block
                    list={mtypes}
                    value={currentMtype}
                    title={`M-type ${mtypes.length ? `(${mtypes.length})` : ''}`}
                    onSelect={setMtype}
                    theme={theme}
                  />
                  <List
                    block
                    list={etypes}
                    value={currentEtype}
                    title={`E-type ${etypes.length ? `(${etypes.length})` : ''}`}
                    onSelect={setEtype}
                    theme={theme}
                  />
                  <List
                    block
                    list={morphologies}
                    value={currentMorphology}
                    title={`Morphology ${morphologies.length ? `(${morphologies.length})` : ''}`}
                    onSelect={setMorphology}
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
          { id: 'ExperimentalMorphologySection', label: 'Experimental morphology used for this model' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible id="traceSection" className="mt-4" title="Trace">
          <div className="graph">
            {traceData && <TraceGraph plotData={traceData} />}
          </div>

          {traceData && (
            <div className="mt-4">
              <DownloadButton onClick={() => downloadAsJson(traceData, `${currentMtype}-${currentEtype}-${currentMorphology}-trace.json`)} theme={theme}>
                Trace data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        {/*
        <Collapsible id="bPAPPSPSection" className="mt-4" title="bPAP & PSP">
          <div className="graph">
             Add bPAP & PSP graph component here 
          </div>
        </Collapsible>
        */}

        <Collapsible id="factsheetSection" className="mt-4" title="Factsheet">
          {factsheetData && (
            <>
              <Factsheet facts={factsheetData} />
              <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(factsheetData, `${currentMtype}-${currentEtype}-${currentMorphology}-factsheet.json`)} theme={theme}>
                  Factsheet
                </DownloadButton>
              </div>
            </>
          )}
        </Collapsible>
        <Collapsible id="ExperimentalMorphologySection" className="mt-4" title="Experimental morphology used for this model">
          <ExperimentalMorphologyTable MorphologyData={modelsData} currentInstance={currentMorphology} isMorphologyLibrary={true} />
        </Collapsible>
      </DataContainer>

    </>
  );
};

export default withPreselection(
  NeuronsView,
  {
    key: 'mtype',
    defaultQuery: defaultSelection.digitalReconstruction.neurons,
  },
);
