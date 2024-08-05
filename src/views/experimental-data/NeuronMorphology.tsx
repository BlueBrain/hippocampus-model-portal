import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import groupBy from 'lodash/groupBy';

import { hippocampus, deploymentUrl } from '@/config';
import { defaultSelection, layers } from '@/constants';
import { Layer } from '@/types';

import { morphologyDataQuery, mtypeExpMorphologyListDataQuery } from '@/queries/es';
import {
  expMorphFactesheetPath,
  expMorphPopulationFactesheetPath,
  expMorphPopulationDistributionPlotsPath,
  expMorphDistributionPlotsPath,
} from '@/queries/http';

import ESData from '@/components/ESData';
import HttpData from '@/components/HttpData';
import StickyContainer from '@/components/StickyContainer';
import DataContainer from '@/components/DataContainer';
import LayerSelector3D from '@/components/LayerSelector3D';
import Filters from '@/layouts/Filters';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import NexusPlugin from '@/components/NexusPlugin';
import Collapsible from '@/components/Collapsible';
import List from '@/components/List';
import AuthorBox from '@/components/AuthorBox/AuthorBox';
import Factsheet, { FactsheetEntryType } from '@/components/Factsheet';
import ExpMorphologyTable from '@/components/ExpMorphologyTable';
import NexusFileDownloadButton from '@/components/NexusFileDownloadButton';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import Metadata from '@/components/Metadata';
import MorphologyRelatedTraces from '@/components/MorphologyRelatedTraces';
import MorphDistributionPlots from '@/components/MorphDistributionsPlots';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import { colorName } from './config';
import morphologies from '@/exp-morphology-list.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

const factsheetEntryTypes = [
  'all',
  'soma',
  'dendrite',
  'axon',
  'apical',
  'basal',
];

const NeuriteTypeGroupedFactsheets = ({ facts, id }) => {
  const factsGrouped = groupBy(facts, fact => factsheetEntryTypes.find(entryType => fact.type === entryType));

  return (
    <div id={id}>
      {factsheetEntryTypes
        .filter(entryType => factsGrouped[entryType])
        .map(entryType => (
          <div key={entryType}>
            <h4 className="capitalize">{entryType}</h4>
            <Factsheet facts={factsGrouped[entryType]} />
          </div>
        ))}
    </div>
  );
};

const getMtypes = (layer) => {
  return layer
    ? Array.from(new Set(morphologies.filter(m => m.region === layer).map(m => m.mtype))).sort()
    : [];
};

const getInstances = (mtype) => {
  return mtype
    ? morphologies.filter(m => m.mtype === mtype).map(m => m.name).sort()
    : [];
};

const NeuronExperimentalMorphology = () => {
  const router = useRouter();
  const nexus = useNexusContext();
  const { query } = router;

  const theme = 1;
  const currentLayer = query.layer;
  const currentMtype = query.mtype;
  const currentInstance = query.instance;

  const setQuery = (query) => {
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer) => {
    setQuery({
      layer,
      mtype: null,
      instance: null,
    });
  };

  const setMtype = (mtype) => {
    setQuery({
      mtype,
      layer: currentLayer,
      instance: null,
    });
  };

  const setInstance = (instance) => {
    setQuery({
      instance,
      layer: currentLayer,
      mtype: currentMtype,
    });
  };

  const mtypes = getMtypes(currentLayer);
  const instances = getInstances(currentMtype);

  const getMorphologyDistribution = (morphologyResource) => {
    return morphologyResource.distribution.find((d) => d.name.match(/\.asc$/i));
  };

  const getAndSortMorphologies = (esDocuments) => {
    return esDocuments
      .map((esDocument) => esDocument._source)
      .sort((m1, m2) => (m1.name > m2.name ? 1 : -1));
  };

  const filterMorphologies = (morphologies, currentInstance) => {
    return morphologies.filter(morphology => morphology.name === currentInstance);
  };

  return (
    <>
      <Filters theme={theme} hasData={!!currentInstance}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title={<span>Neuronal Morphology</span>}
                subtitle="Experimental Data"
                theme={theme}
              />
              <div className='w-full' role="information">
                <InfoBox>
                  <p>
                    We classified neuronal morphologies into different morphological types (m-types) and created digital 3D reconstructions. Using objective classification methods, we identified 12 m-types in region CA1 of the rat hippocampus.
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
                  value={currentMtype}
                  title="m-type"
                  color={colorName}
                  onSelect={setMtype}
                  theme={theme}
                />
                <List
                  block
                  list={instances}
                  value={currentInstance}
                  title="Reconstructed morphology"
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
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>


      <DataContainer theme={theme}
        visible={!!currentInstance}
        navItems={[
          { id: 'morphologySection', label: 'Neuron Morphology' },
          { id: 'populationSection', label: 'Population' },
        ]}
      >

        <Collapsible
          id="morphologySection"
          title="Neuron Morphology"
          properties={[currentLayer, currentMtype, currentInstance]} // Assuming 'layer' is a string
        >
          <ESData query={morphologyDataQuery(currentMtype, currentInstance)}>
            {(esDocuments) => {
              if (!esDocuments || !esDocuments.length) return null;
              const esDocument = esDocuments[0]._source;
              return (
                <>
                  <AuthorBox>
                    <Metadata nexusDocument={esDocument} />
                  </AuthorBox>

                  <p className='text-lg mt-10 '>
                    We provide visualization and morphometrics for the selected morphology.
                  </p>


                  <h3 className='text-xl mt-10 mb-2'>3D view</h3>
                  <div className="graph no-margin">
                    <NexusPlugin
                      className=""
                      name="neuron-morphology"
                      resource={esDocument}
                      nexusClient={nexus}
                    />
                  </div>
                  <div className="text-right">
                    <a
                      className="mr-1 btn btn-primary btn-sm"
                      href={`${deploymentUrl}/build/data/morphology?query=${encodeURIComponent(currentInstance)}`}
                    >
                      Send to the Build section
                    </a>

                    <NexusFileDownloadButton
                      id="morphologyDownloadBtn"
                      className="mt-3"
                      filename={getMorphologyDistribution(esDocument).name}
                      url={getMorphologyDistribution(esDocument).contentUrl}
                      org={hippocampus.org}
                      project={hippocampus.project}
                    >
                      morphology
                    </NexusFileDownloadButton>
                  </div>
                  <div className="mt-3">
                    <MorphologyRelatedTraces morphology={esDocument} />
                  </div>
                </>
              );
            }}
          </ESData>

          <HttpData path={expMorphFactesheetPath(currentInstance)}>
            {(factsheetData) => (
              <div className="mt-3">
                <h3 className='text-xl mb-2 mt-10'>Factsheet</h3>
                {factsheetData && (
                  <>
                    <NeuriteTypeGroupedFactsheets id="morphometrics" facts={factsheetData.values} />
                    <div className="text-right mt-2">
                      <HttpDownloadButton
                        href={expMorphFactesheetPath(currentInstance)}
                        download={`exp-morphology-factsheet-${currentInstance}.json`}
                      >
                        factsheet
                      </HttpDownloadButton>
                    </div>
                  </>
                )}
              </div>
            )}
          </HttpData>



          <HttpData path={expMorphDistributionPlotsPath(currentInstance)}>
            {(plotsData) => (
              <div className="mt-4">
                <h3 className='text-xl mt-2 mb-2'>Distributions</h3>
                {plotsData && (
                  <>
                    <MorphDistributionPlots type="singleMorphology" data={plotsData} />
                    <div className="text-right mt-3">
                      <HttpDownloadButton
                        href={expMorphDistributionPlotsPath(currentInstance)}
                        download={`exp-morphology-distributions-factsheet-${currentInstance}.json`}
                      >
                        distributions
                      </HttpDownloadButton>
                    </div>
                  </>
                )}
              </div>
            )}
          </HttpData>

          <ESData query={mtypeExpMorphologyListDataQuery(currentMtype)}>
            {(esDocuments) => {
              if (!esDocuments) return null;
              const filteredMorphologies = filterMorphologies(getAndSortMorphologies(esDocuments), currentInstance);
              return (
                <ExpMorphologyTable
                  layer={currentLayer}
                  mtype={currentMtype}
                  morphologies={filteredMorphologies}
                  currentMorphology={currentInstance}
                />
              );
            }}
          </ESData>
        </Collapsible>

        <Collapsible
          id="populationSection"
          title="Population"
          className="mt-4 mb-4"
        >
          <p className='text-base mb-4'>
            We provide morphometrics for the entire m-type group selected.
          </p>
          <HttpData path={expMorphPopulationFactesheetPath(currentMtype)}>
            {(factsheetData) => (
              <div>
                <h3 className='text-xl mt-4 mb-4'>Factsheet</h3>
                {factsheetData && (
                  <>
                    <NeuriteTypeGroupedFactsheets facts={factsheetData.values} />
                    <div className="text-right mt-3">
                      <DownloadButton
                        theme={theme}
                        href={expMorphPopulationFactesheetPath(currentMtype)}
                        download={`exp-morphology-population-factsheet-${currentMtype}.json`}
                      ><span className='collapsible-property small' style={{ margin: '2px' }}>{currentLayer}</span><span className='collapsible-property small' style={{ margin: '2px' }}>{currentMtype}</span><span className='collapsible-property small' style={{ margin: '2px' }}>{currentInstance}</span> Population Factsheet
                      </DownloadButton>
                    </div>
                  </>
                )}
              </div>
            )}
          </HttpData >

          {
            instances.length > 1 && (
              <HttpData path={expMorphPopulationDistributionPlotsPath(currentMtype)}>
                {(plotsData) => (
                  <div className="mt-4">
                    <h3 className='text-xl mt-2 mb-2'>Distributions</h3>
                    {plotsData && (
                      <>
                        <MorphDistributionPlots type="population" data={plotsData} />
                        <div className="text-right mt-2">
                          <HttpDownloadButton
                            href={expMorphPopulationDistributionPlotsPath(currentMtype)}
                            download={`exp-morphology-population-distributions-${currentMtype}.json`}
                          >
                            distributions
                          </HttpDownloadButton>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </HttpData>
            )
          }

          < h3 className="mt-4" > Reconstructed morphologies</h3 >
          <p>
            Reconstructed morphologies from the selected m-type
          </p>
          <ESData query={mtypeExpMorphologyListDataQuery(currentMtype)}>
            {(esDocuments) => {
              if (!esDocuments) return null;
              const filteredMorphologies = filterMorphologies(getAndSortMorphologies(esDocuments), currentInstance);
              return (
                <ExpMorphologyTable
                  layer={currentLayer}
                  mtype={currentMtype}
                  morphologies={filteredMorphologies}
                  currentMorphology={currentInstance}
                />
              );
            }}
          </ESData>
        </Collapsible >
      </DataContainer >
    </>
  );
};

const hocPreselection = withPreselection(
  NeuronExperimentalMorphology,
  {
    key: 'layer',
    defaultQuery: defaultSelection.experimentalData.neuronMorphology,
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
    title: 'Instance',
    key: 'instance',
    getValuesFn: getInstances,
    getValuesParam: 'mtype',
    paramsToKeepOnChange: ['layer', 'mtype'],
  },
];

export default withQuickSelector(
  hocPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);
