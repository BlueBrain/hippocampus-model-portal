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

import modelsData from './morphology-library.json';
import LayerSelector3D from '@/components/LayerSelector3D';
import { basePath } from '@/config';

// Helper function to get unique values
const getUniqueValues = (
  key: string,
  filterKey1?: string,
  filterValue1?: string,
  filterKey2?: string,
  filterValue2?: string
): string[] => {
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
  ).sort();
};

// Updated helper function to get filtered morphologies
const getFilteredMorphologies = (layer: string, mtype: string, etype: string): string[] => {
  return modelsData
    .filter(
      (model) =>
        (layer === '' || model.layer === layer) &&
        (mtype === '' || model.mtype === mtype) &&
        (etype === '' || model.etype === etype)
    )
    .map((model) => model.morphology)
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .sort();
};

const MorphologyLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentLayer, setCurrentLayer] = useState<string>(query.layer || '');
  const [currentMtype, setCurrentMtype] = useState<string>(query.mtype || '');
  const [currentEtype, setCurrentEtype] = useState<string>(query.etype || '');
  const [currentMorphology, setCurrentMorphology] = useState<string>(query.morphology || '');

  const layers = useMemo(() => getUniqueValues('layer'), []);
  const mtypes = useMemo(
    () => getUniqueValues('mtype', 'layer', currentLayer),
    [currentLayer]
  );
  const etypes = useMemo(
    () => getUniqueValues('etype', 'layer', currentLayer, 'mtype', currentMtype),
    [currentLayer, currentMtype]
  );
  const morphologies = useMemo(
    () => getFilteredMorphologies(currentLayer, currentMtype, currentEtype),
    [currentLayer, currentMtype, currentEtype]
  );

  // Automatically select the first mtype and etype when the layer is selected
  useEffect(() => {
    if (currentLayer) {
      const newMtype = mtypes.length > 0 ? mtypes[0] : '';
      const newEtype = getUniqueValues('etype', 'layer', currentLayer, 'mtype', newMtype)[0] || '';
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

  // Automatically select the first etype when the mtype is selected
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

  // Ensure etype selection works and updates the state
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

  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer: string) => {
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
      >
        <Collapsible
          id="morphologySection"
          title="Neuron Morphology"
          properties={[currentLayer, currentMtype, currentEtype, currentMorphology]}
        >
          <p className='text-lg mb-2'>
            We provide visualization and morphometrics for the selected morphology.
          </p>
          <HttpData path={`${basePath}/resources/data/2_reconstruction-data/morphology-library/all/${currentMorphology}/factsheet.json`}>
            {(factsheetData) => (
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
            <HttpData path={`${basePath}/resources/data/2_reconstruction-data/morphology-library/per_mtype/${currentMtype}/factsheet.json`}>
              {(factsheetData) => (
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