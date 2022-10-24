import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import { Button, Spin } from 'antd';
import groupBy from 'lodash/groupBy';

import { hippocampus, deploymentUrl } from '@/config';
import { defaultSelection, layers } from '@/constants';
import { Layer } from '@/types';

import ESData from '@/components/ESData';
import HttpData from '@/components/HttpData';
import DataContainer from '@/components/DataContainer';
import LayerSelector from '@/components/LayerSelector';
import { morphologyDataQuery, mtypeExpMorphologyListDataQuery } from '@/queries/es';
import {
  expMorphFactesheetPath,
  expMorphPopulationFactesheetPath,
  expMorphPopulationDistributionPlotsPath,
  expMorphDistributionPlotsPath,
} from '@/queries/http';
import Filters from '@/layouts/Filters';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import NexusPlugin from '@/components/NexusPlugin';
import { colorName } from './config';
import Collapsible from '@/components/Collapsible';
import List from '@/components/List';
import Factsheet, { FactsheetEntryType } from '@/components/Factsheet';
import ExpMorphologyTable from '@/components/ExpMorphologyTable';
import NexusFileDownloadButton from '@/components/NexusFileDownloadButton';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import Metadata from '@/components/Metadata';
import MorphologyRelatedTraces from '@/components/MorphologyRelatedTraces';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';
import MorphDistributionPlots from '@/components/MorphDistributionsPlots';

import morphologies from '@/exp-morphology-list.json';

import styles from '@/styles/experimental-data/neuron-morphology.module.scss';


const factsheetEntryTypes = [
  'all',
  'axon',
  'dendrite',
  'apical',
  'basal',
  'soma',
];

type NeuriteTypeGroupedFactsheetsProps = {
  facts: FactsheetEntryType[];
  id?: string;
}

const NeuriteTypeGroupedFactsheets: React.FC<NeuriteTypeGroupedFactsheetsProps> = ({ facts, id }) => {
  const factsGrouped = groupBy(facts, fact => factsheetEntryTypes.find(entryType => fact.name.includes(entryType)) ?? '-');

  return (
    <div id={id}>
      {factsheetEntryTypes
        .filter(entryType => factsGrouped[entryType])
        .map(entryType => (
          <div key={entryType}>
            <h4 className="text-capitalize">{entryType}</h4>
            <Factsheet facts={factsGrouped[entryType]} />
          </div>
        ))
      }
    </div>
  );
};

const getMtypes = (layer) => {
  return layer
    ? Array.from(new Set(morphologies.filter(m => m.region === layer).map(m => m.mtype))).sort()
    : [];
}

const getInstances = (mtype) => {
  return mtype
    ? morphologies.filter(m => m.mtype === mtype).map(m => m.name).sort()
    : [];
}

const NeuronExperimentalMorphology: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const { query } = router;

  const setQuery = (query: any): void => {
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setLayer = (layer: Layer) => {
    setQuery({
      layer,
      mtype: null,
      instance: null,
    });
  };
  const currentLayer: Layer = query.layer as Layer;

  const mtypes = getMtypes(currentLayer);

  const setMtype = (mtype: string) => {
    setQuery({
      mtype,
      layer: currentLayer,
      instance: null,
    });
  };
  const currentMtype: string = query.mtype as string;

  const instances = getInstances(currentMtype);

  const setInstance = (instance: string) => {
    setQuery({
      instance,
      layer: currentLayer,
      mtype: currentMtype,
    });
  };
  const currentInstance: string = query.instance as string;

  const getMorphologyDistribution = (morphologyResource: any) => {
    return morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i));
  };

  const getAndSortMorphologies = (esDocuments) => {
    return esDocuments
      .map(esDocument => esDocument._source)
      .sort((m1, m2) => (m1.name > m2.name) ? 1 : -1);
  };

  return (
    <>
      <Filters hasData={!!currentInstance}>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor={colorName}
              title={<span>Neuronal <br /> Morphology</span>}
              subtitle="Experimental Data"
            />
            <InfoBox>
              <p>
                We classified neuronal morphologies in different morphological types (m-types)
                and created digital 3D reconstructions. Using objective classification methods,
                we have identified 12 m-types in rat hippocampus CA1.
              </p>
            </InfoBox>
          </div>
          <div className="col-xs-12 col-lg-6">
            <div className={styles.selector}>
              <div className={styles.selectorColumn}>
                <div className={styles.selectorHead}>1. Choose a layer</div>
                <div className={styles.selectorBody}>
                  <LayerSelector
                    value={currentLayer}
                    onSelect={setLayer}
                  />
                </div>
              </div>
              <div className={styles.selectorColumn}>
                <div className={styles.selectorHead}>2. Select reconstruction</div>
                <div className={styles.selectorBody}>
                  <List
                    block
                    list={mtypes}
                    value={currentMtype}
                    title="m-type"
                    color={colorName}
                    onSelect={setMtype}
                  />
                  <br />
                  <br />
                  <br />
                  <List
                    block
                    list={instances}
                    value={currentInstance}
                    title="Reconstructed morphology"
                    color={colorName}
                    onSelect={setInstance}
                    anchor="data"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        visible={!!currentInstance}
        navItems={[
          { id: 'morphologySection', label: 'Neuron Morphology' },
          { id: 'populationSection', label: 'Population' },
        ]}
      >
        <Collapsible
          id="morphologySection"
          title={`Neuron Morphology ${currentMtype} ${currentInstance}`}
        >
          <ESData
            query={morphologyDataQuery(currentMtype, currentInstance)}
          >
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <>
                    <Metadata nexusDocument={esDocuments[0]._source} />
                    <h3>3D view</h3>
                    <NexusPlugin
                      className="mt-3"
                      name="neuron-morphology"
                      resource={esDocuments[0]._source}
                      nexusClient={nexus}
                    />
                    <div className="text-right">
                      <Button
                        className="mr-1"
                        type="primary"
                        size="small"
                        href={`${deploymentUrl}/build/data/morphology?query=${encodeURIComponent(currentInstance)}`}
                      >
                        Send to the Build section
                      </Button>

                      <NexusFileDownloadButton
                        id="morphologyDownloadBtn"
                        className="mt-3"
                        filename={getMorphologyDistribution(esDocuments[0]._source).name}
                        url={getMorphologyDistribution(esDocuments[0]._source).contentUrl}
                        org={hippocampus.org}
                        project={hippocampus.project}
                      >
                        morphology
                      </NexusFileDownloadButton>
                    </div>
                    <div className="mt-3">
                      <MorphologyRelatedTraces morphology={esDocuments[0]._source} />
                    </div>
                  </>
                )}
              </>
            )}
          </ESData>

          <HttpData path={expMorphFactesheetPath(currentInstance)}>
            {(factsheetData, loading) => (
              <div className="mt-3">
                <h3>Factsheet</h3>
                <Spin spinning={loading}>
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
                </Spin>
              </div>
            )}
          </HttpData>

          <HttpData path={expMorphDistributionPlotsPath(currentInstance)}>
            {(plotsData, loading) => (
              <div className="mt-4">
                <h3>Distributions</h3>
                <Spin spinning={loading}>
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
                </Spin>
              </div>
            )}
          </HttpData>
        </Collapsible>

        <Collapsible
          id="populationSection"
          title="Population"
          className="mt-4 mb-4"
        >
          <HttpData path={expMorphPopulationFactesheetPath(currentMtype)}>
            {(factsheetData, loading) => (
              <div>
                <h3>Factsheet</h3>
                <Spin spinning={loading}>
                  {factsheetData && (
                    <>
                      <NeuriteTypeGroupedFactsheets facts={factsheetData.values} />
                      <div className="text-right mt-3">
                        <HttpDownloadButton
                          href={expMorphPopulationFactesheetPath(currentMtype)}
                          download={`exp-morphology-population-factsheet-${currentMtype}.json`}
                        >
                          factsheet
                        </HttpDownloadButton>
                      </div>
                    </>
                  )}
                </Spin>
              </div>
            )}
          </HttpData>

          {instances.length > 1 && (
            <HttpData path={expMorphPopulationDistributionPlotsPath(currentMtype)}>
              {(plotsData, loading) => (
                <div className="mt-4">
                  <h3>Distributions</h3>
                  <Spin spinning={loading}>
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
                  </Spin>
                </div>
              )}
            </HttpData>
          )}

          <h3 className="mt-4">Reconstructed morphologies</h3>
          <ESData query={mtypeExpMorphologyListDataQuery(currentMtype)}>
            {esDocuments => (
              <>
                {!!esDocuments &&
                  <ExpMorphologyTable
                    layer={currentLayer}
                    mtype={currentMtype}
                    morphologies={getAndSortMorphologies(esDocuments)}
                    currentMorphology={currentInstance}
                  />
                }
              </>
            )}
          </ESData>
        </Collapsible>
      </DataContainer>
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
