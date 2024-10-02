import React, { useEffect, useState, useMemo, useRef } from 'react';
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

import modelsData from './neuron-model-libraries.json';
import MechanismTable from './neuron-model/MechanismTable';
import MorphologyViewer from '@/components/MorphologyViewer';


type ModelData = {
  mtype: string;
  etype: string;
  // Add other properties as needed
};

const getUniqueValues = (key: keyof ModelData, filterKey?: keyof ModelData, filterValue?: string): string[] => {
  return Array.from(new Set(modelsData
    .filter(model =>
      (!filterKey || !filterValue || model[filterKey] === filterValue)
    )
    .map(model => model[key] as string))).sort();
};

const getFilteredData = (mtype: string, etype: string): ModelData[] => {
  return modelsData
    .filter(model =>
      (!mtype || model.mtype === mtype) &&
      (!etype || model.etype === etype)
    );
};

const NeuronsModelLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentMtype, setCurrentMtype] = useState('');
  const [currentEtype, setCurrentEtype] = useState('');
  const [traceData, setTraceData] = useState<any | null>(null);
  const [factsheetData, setFactsheetData] = useState<any | null>(null);
  const [morphologyData, setMorphologyData] = useState<string | null>(null);

  const mtypes = useMemo(() => getUniqueValues('mtype'), []);
  const etypes = useMemo(() => getUniqueValues('etype', 'mtype', currentMtype), [currentMtype]);

  useEffect(() => {
    if (Object.keys(query).length === 0) return;

    const newMtype = query.mtype && typeof query.mtype === 'string' && mtypes.includes(query.mtype)
      ? query.mtype
      : mtypes[0] || '';

    const newEtypes = getUniqueValues('etype', 'mtype', newMtype);
    const newEtype = query.etype && typeof query.etype === 'string' && newEtypes.includes(query.etype)
      ? query.etype
      : newEtypes[0] || '';

    setCurrentMtype(newMtype);
    setCurrentEtype(newEtype);
  }, [query, mtypes]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentMtype && currentEtype) {
        try {
          const filteredData = getFilteredData(currentMtype, currentEtype)[0];
          if (filteredData) {
            const [traceResponse, factsheetResponse, morphologyResponse] = await Promise.all([
              fetch(`${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/1/trace.json`),
              fetch(`${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/1/features_with_rheobase.json`),
              fetch(`${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/1/morphology.swc`),
            ]);

            const traceData = await traceResponse.json();
            const factsheetData = await factsheetResponse.json();
            const morphologyData = await morphologyResponse.text();

            setTraceData(traceData);
            setFactsheetData(factsheetData);
            setMorphologyData(morphologyData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setTraceData(null);
          setFactsheetData(null);
          setMorphologyData(null);
        }
      }
    };

    fetchData();
  }, [currentMtype, currentEtype]);

  const setParams = (params: { mtype?: string; etype?: string }) => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setMtype = (mtype: string) => {
    const newEtypes = getUniqueValues('etype', 'mtype', mtype);
    const newEtype = newEtypes[0] || '';

    setParams({
      mtype,
      etype: newEtype,
    });
  };

  const setEtype = (etype: string) => {
    setParams({
      etype,
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
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
  ];

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Neuron model library"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                Initial set of single <Link className={`link theme-${theme}`} href="/reconstruction-data/neuron-models">cell models</Link> are combined with the <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphology library</Link> to produce a library of neuron models.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
            <div className="selector">
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
          { id: 'bPAPPSPSection', label: 'bPAP & PSP' },
          { id: 'traceSection', label: 'Trace' },
          { id: 'factsheetSection', label: 'Factsheet' }
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="bPAPPSPSection"
          className="mt-4"
          title="bPAP & PSP"
        >
          <div className="graph">
            {morphologyData && <MorphologyViewer swc={morphologyData} />}
          </div>
          {morphologyData && (
            <div className="mt-4">
              <DownloadButton onClick={() => downloadAsJson(morphologyData, `${currentMtype}-${currentEtype}-morphology.json`)} theme={theme}>
                Morphology data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        <Collapsible id="traceSection" className="mt-4" title="Trace">
          <div className="graph">
            {traceData && <TraceGraph plotData={traceData} />}
          </div>

          {traceData && (
            <div className="mt-4">
              <DownloadButton onClick={() => downloadAsJson(traceData, `${currentMtype}-${currentEtype}-trace.json`)} theme={theme}>
                Trace data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        <Collapsible id="factsheetSection" className="mt-4" title="Factsheet">
          {factsheetData && (
            <>
              <Factsheet facts={factsheetData} />
              <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(factsheetData, `${currentMtype}-${currentEtype}-factsheet.json`)} theme={theme}>
                  Factsheet
                </DownloadButton>
              </div>
            </>
          )}
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default withPreselection(
  NeuronsModelLibrary,
  {
    key: 'mtype',
    defaultQuery: defaultSelection.digitalReconstruction.NeuronModelLibrary,
  },
);