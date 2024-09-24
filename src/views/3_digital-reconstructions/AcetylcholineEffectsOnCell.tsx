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


const getUniqueValues = (key: string, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string): string[] => {
  return Array.from(new Set(modelsData
    .filter(model =>
      (!filterKey1 || !filterValue1 || model[filterKey1] === filterValue1) &&
      (!filterKey2 || !filterValue2 || model[filterKey2] === filterValue2)
    )
    .map(model => model[key]))).sort();
};

const getFilteredMorphologies = (mtype: string, etype: string): string[] => {
  return modelsData
    .filter(model =>
      (!mtype || model.mtype === mtype) &&
      (!etype || model.etype === etype)
    )
    .map(model => model.morphology);
};

const AcetylcholineEffectsOnCellView: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentMtype, setCurrentMtype] = useState<string>('');
  const [currentEtype, setCurrentEtype] = useState<string>('');
  const [currentMorphology, setCurrentMorphology] = useState<string>('');
  const [singleCellData, setSingleCellData] = useState<any>(null);
  const [traceData, setTraceData] = useState<any>(null);
  const [populationData, setPopulationData] = useState<any>(null);

  const mtypes = useMemo(() => getUniqueValues('mtype'), []);
  const etypes = useMemo(() => getUniqueValues('etype', 'mtype', currentMtype), [currentMtype]);
  const morphologies = useMemo(() => getFilteredMorphologies(currentMtype, currentEtype), [currentMtype, currentEtype]);

  useEffect(() => {
    console.log('Query changed:', query);
    if (Object.keys(query).length === 0) return;

    const newMtypes = getUniqueValues('mtype');
    const newMtype = query.mtype && typeof query.mtype === 'string' && newMtypes.includes(query.mtype)
      ? query.mtype
      : newMtypes[0] || '';

    const newEtypes = getUniqueValues('etype', 'mtype', newMtype);
    const newEtype = query.etype && typeof query.etype === 'string' && newEtypes.includes(query.etype)
      ? query.etype
      : newEtypes[0] || '';

    const newMorphologies = getFilteredMorphologies(newMtype, newEtype);
    const newMorphology = query.morphology && typeof query.morphology === 'string' && newMorphologies.includes(query.morphology)
      ? query.morphology
      : newMorphologies[0] || '';

    console.log('Updating states:', { newMtype, newEtype, newMorphology });
    setCurrentMtype(newMtype);
    setCurrentEtype(newEtype);
    setCurrentMorphology(newMorphology);
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentMorphology) {
        try {
          const [singleCellResponse, traceResponse, populationResponse] = await Promise.all([
            fetch(`${dataPath}3_digital-reconstruction/acteylcholine-effect-on-cells/${currentMtype}/${currentEtype}/${currentMorphology}/ach_features_processed.json`),
            fetch(`${dataPath}3_digital-reconstruction/acteylcholine-effect-on-cells/${currentMtype}/${currentEtype}/${currentMorphology}/trace.json`),
            fetch(`${dataPath}3_digital-reconstruction/acteylcholine-effect-on-cells/${currentMtype}/${currentEtype}/ach_population_agg_processed.json`),
          ]);

          const singleCellData = await singleCellResponse.json();
          const traceData = await traceResponse.json();
          const populationData = await populationResponse.json();

          setSingleCellData(singleCellData);
          setTraceData(traceData);
          setPopulationData(populationData);
        } catch (error) {
          console.error('Error fetching data:', error);

          setSingleCellData(null);
          setTraceData(null);
          setPopulationData(null);
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
    console.log('Setting new params:', newQuery);
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
    {
      title: 'Morphology',
      key: 'morphology',
      values: morphologies,
      setFn: setMorphology,
    },
  ];

  console.log('Current states:', { currentMtype, currentEtype, currentMorphology });

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Acetylcholine - Effects on Cells"
              subtitle="Digital Reconstructions"
              theme={theme}
            />
            <div className='w-full' role="information">
              <InfoBox>
                <p>
                  We applied the  <Link className={`link theme-${theme}`} href={'/reconstruction-data/acetylcholine/'}>dose-effect curves</Link> to predict the effect of acetylcholine on neuron membrane resting potential or firing rate.
                </p>
              </InfoBox>
            </div>
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
          { id: 'singleCellSection', label: 'Single Cell' },
          { id: 'traceSection', label: 'Trace' },
          { id: 'populationSection', label: 'Population' },
        ]}
        quickSelectorEntries={qsEntries}
      >

        <Collapsible id="singleCellSection" className="mt-4" title="Single Cell">
          {singleCellData && (
            <>

              <PopulationFactsheet data={singleCellData} />
              <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(singleCellData, `Single-Cell-factsheet.json`)} theme={theme}>
                  Population Factsheet
                </DownloadButton>
              </div>
            </>
          )}
        </Collapsible>

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

        <Collapsible id="populationSection" className="mt-4" title="Population">
          {populationData && (
            <>
              <PopulationFactsheet data={populationData} />
              <div className="mt-4">
                <DownloadButton onClick={() => downloadAsJson(populationData, `Population-factsheet.json`)} theme={theme}>
                  Population Factsheet
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
  AcetylcholineEffectsOnCellView,
  {
    key: 'mtype',
    defaultQuery: defaultSelection.digitalReconstruction.acetylcholineEffectsOnCell,
  },
);