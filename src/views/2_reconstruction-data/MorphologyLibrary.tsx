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
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import NeuronFactsheet from '../1_experimental-data/neuronal-morphology/NeuronFactsheet';

import LayerSelector3D from '@/components/LayerSelector3D';
import { Layer } from '@/types';
import { basePath } from '@/config';

import modelsDataImport from './morphology-library.json';
import MorphDistributionPlots from '@/components/MorphDistributionsPlots';

type ModelData = {
  layer: Layer;
  mtype: string;
  etype: string;
  morphology: string;
};

const modelsData: ModelData[] = (Array.isArray(modelsDataImport) ? modelsDataImport : [modelsDataImport]) as ModelData[];

const getUniqueValues = (
  key: keyof ModelData,
  filterKey1?: keyof ModelData,
  filterValue1?: Layer | string,
  filterKey2?: keyof ModelData,
  filterValue2?: string
): (Layer | string)[] => {
  return Array.from(
    new Set(
      modelsData
        .filter(
          (model) =>
            (!filterKey1 || !filterValue1 || model[filterKey1] === filterValue1) &&
            (!filterKey2 || !filterValue2 || model[filterKey2] === filterValue2)
        )
        .map((model) => model[key])
    )
  )
    .filter((value): value is Layer | string => value != null) // Remove null and undefined
    .sort((a, b) => a.toString().localeCompare(b.toString()));
};

const getFilteredMorphologies = (layer: Layer | '', mtype: string, etype: string): string[] => {
  return modelsData
    .filter(
      (model) =>
        (layer === '' || model.layer === layer) &&
        (mtype === '' || model.mtype === mtype) &&
        (etype === '' || model.etype === etype)
    )
    .map((model) => model.morphology)
    .filter((value): value is string => value != null) // Remove null and undefined
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();
};

const MorphologyLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentLayer, setCurrentLayer] = useState<Layer | ''>((query.layer as Layer) || '');
  const [currentMtype, setCurrentMtype] = useState<string>((query.mtype as string) || '');
  const [currentEtype, setCurrentEtype] = useState<string>((query.etype as string) || '');
  const [currentMorphology, setCurrentMorphology] = useState<string>((query.morphology as string) || '');

  const layers = useMemo(() => getUniqueValues('layer') as Layer[], []);
  const mtypes = useMemo(
    () => getUniqueValues('mtype', 'layer', currentLayer) as string[],
    [currentLayer]
  );
  const etypes = useMemo(
    () => getUniqueValues('etype', 'layer', currentLayer, 'mtype', currentMtype) as string[],
    [currentLayer, currentMtype]
  );
  const morphologies = useMemo(
    () => getFilteredMorphologies(currentLayer, currentMtype, currentEtype),
    [currentLayer, currentMtype, currentEtype]
  );

  useEffect(() => {
    if (currentLayer) {
      const newMtype = mtypes.length > 0 ? mtypes[0] : '';
      const newEtype = getUniqueValues('etype', 'layer', currentLayer, 'mtype', newMtype)[0] as string || '';
      const newMorphology = getFilteredMorphologies(currentLayer, newMtype, newEtype)[0] || '';

      setCurrentMtype(newMtype);
      setCurrentEtype(newEtype);
      setCurrentMorphology(newMorphology);
      setParams({
        layer: currentLayer,
        mtype: newMtype,
        etype: newEtype,
        morphology: newMorphology,
      });
    }
  }, [currentLayer, mtypes]);

  useEffect(() => {
    if (currentMtype) {
      const newEtype = etypes.length > 0 ? etypes[0] : '';
      const newMorphology = getFilteredMorphologies(currentLayer, currentMtype, newEtype)[0] || '';

      setCurrentEtype(newEtype);
      setCurrentMorphology(newMorphology);
      setParams({
        mtype: currentMtype,
        etype: newEtype,
        morphology: newMorphology,
      });
    }
  }, [currentMtype, etypes]);

  useEffect(() => {
    if (currentEtype) {
      const newMorphology = getFilteredMorphologies(currentLayer, currentMtype, currentEtype)[0] || '';
      setCurrentMorphology(newMorphology);
      setParams({
        etype: currentEtype,
        morphology: newMorphology,
      });
    }
  }, [currentEtype]);

  const setParams = (params: Record<string, string | Layer>): void => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer: Layer) => {
    setCurrentLayer(layer);
  };

  const setMtype = (mtype: string) => {
    setCurrentMtype(mtype);
  };

  const setEtype = (etype: string) => {
    setCurrentEtype(etype);
  };

  const setMorphology = (morphology: string) => {
    setCurrentMorphology(morphology);
    setParams({
      morphology,
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
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>Choose a layer</div>
                <div className="selector__selector-container">
                  <LayerSelector3D
                    value={currentLayer || undefined}
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
                    list={morphologies}
                    value={currentMorphology}
                    title={`Morphology ${morphologies.length ? `(${morphologies.length})` : ''}`}
                    color={colorName}
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
        visible={!!(currentMtype || currentMorphology)}
        navItems={[
          { id: 'morphologySection', label: 'Neuron Morphology' },
          { id: 'populationSection', label: 'Population' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="morphologySection"
          title="Neuron Morphology"
          properties={[currentLayer, currentMtype, currentEtype, currentMorphology]}
        >
          <p className='text-lg mb-2'>
            We provide visualization and morphometrics for the selected morphology.
          </p>
          <HttpData path={`${basePath}/data/2_reconstruction-data/morphology-library/all/${currentMorphology}/factsheet.json`}>
            {(factsheetData: any) => (
              <>
                {factsheetData && (
                  <>
                    <NeuronFactsheet id="morphometrics" facts={factsheetData.values} />
                    <div className="mt-4">
                      <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${currentMtype}-factsheet.json`)} theme={theme}>
                        Factsheet
                      </DownloadButton>
                    </div>
                  </>
                )}
              </>
            )}
          </HttpData>
          <div className="mt-4">

            <HttpData path={`${basePath}/data/2_reconstruction-data/morphology-library/section_features/${currentMorphology}/distribution-plots.json`}>
              {(plotsData) => (
                <>
                  {plotsData && (
                    <>
                      <MorphDistributionPlots type="singleMorphology" data={plotsData} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(plotsData, `${currentMorphology}-plot-data.json`)} theme={theme}>
                          Plot Data
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
        </Collapsible>
        <Collapsible
          id="populationSection"
          title="Population"
          properties={[currentMtype]}
        >
          <p className='text-lg mb-2'>
            We provide morphometrics for the entire m-type group selected.
          </p>
          <div className="mb-4">
            <HttpData path={`${basePath}/data/2_reconstruction-data/morphology-library/per_mtype/${currentMtype}/factsheet.json`}>
              {(factsheetData: any) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet id="morphometrics" facts={factsheetData.values} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${currentMtype}-factsheet.json`)} theme={theme}>
                          Factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
          <div className="mt-4">
            public/data/
            <HttpData path={`${basePath}/data/2_reconstruction-data/morphology-library/per_mtype/${currentMtype}/distribution-plot.json`}>
              {(plotsData) => (
                <>
                  {plotsData && (
                    <>
                      <MorphDistributionPlots type="singleMorphology" data={plotsData} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(plotsData, `${currentMorphology}-plot-data.json`)} theme={theme}>
                          Plot Data
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
    key: 'mtype',
    defaultQuery: defaultSelection.digitalReconstruction.morphologyLibrary,
  },
);