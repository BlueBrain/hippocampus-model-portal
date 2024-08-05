import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

// Component Imports
import ESData from '@/components/ESData';
import DataContainer from '@/components/DataContainer';
import NexusPlugin from '@/components/NexusPlugin';
import NexusFileDownloadButton from '@/components/NexusFileDownloadButton';
import Filters from '@/layouts/Filters';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';
import Collapsible from '@/components/Collapsible';
import ExpTraceTable from '@/components/ExpTraceTable';
import Metadata from '@/components/Metadata';
import TraceRelatedMorphologies from '@/components/TraceRelatedMorphologies';

// Graph Imports
import IfCurvePerCellGraph from './neuron-electrophysiology/IfCurvePerCellGraph';
import IfCurvePerETypeGraph from './neuron-electrophysiology/IfCurvePerETypeGraph';

// Config and Query Imports
import { electroPhysiologyDataQuery, etypeTracesDataQuery } from '@/queries/es';
import { deploymentUrl, hippocampus, basePath } from '@/config';
import { colorName } from './config';
import { defaultSelection } from '@/constants';

// HOC Imports
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

// Data Import
import traces from '@/traces.json';
import StickyContainer from '@/components/StickyContainer';

// Helper Functions
const getEphysDistribution = (resource) => Array.isArray(resource.distribution)
  ? resource.distribution.find((d) => d.name.match(/\.nwb$/i))
  : resource.distribution;

const getEtype = () => Object.keys(traces).sort();
const getInstance = (etype) => etype ? traces[etype].sort() : [];

const NeuronElectrophysiology = () => {
  const router = useRouter();
  const nexus = useNexusContext();
  const theme = 1;
  const { query } = router;

  const setQuery = (newQuery) => {
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setEtype = (etype) => setQuery({ etype, etype_instance: null });
  const setInstance = (instance) => setQuery({ etype: currentEtype, etype_instance: instance });

  const currentEtype = query.etype as string;
  const currentInstance = query.etype_instance as string;

  const etypes = getEtype();
  const instances = getInstance(currentEtype);

  const fullElectroPhysiologyDataQueryObj = useMemo(() =>
    electroPhysiologyDataQuery(currentEtype, currentInstance),
    [currentEtype, currentInstance]
  );

  const etypeTracesDataQueryObj = useMemo(() =>
    etypeTracesDataQuery(currentEtype),
    [currentEtype]
  );

  const getAndSortTraces = (esDocuments) =>
    esDocuments
      .map(esDocument => esDocument._source)
      .sort((m1, m2) => (m1.name > m2.name) ? 1 : -1);

  return (
    <>

      <Filters theme={theme} hasData={!!currentInstance}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title={<span>Neuron <br /> Electrophysiology</span>}
                subtitle="Experimental Data"
                theme={theme}
              />
              <div className='w-full' role="information">
                <InfoBox>
                  <p>
                    We recorded electrical traces from neurons using single-cell recording experiments in brain slices.
                    Then, we classified the traces in different electrical types (e-types) based on their firing patterns.
                    We identified one e-type for excitatory cells and four e-types for inhibitory cells.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none justify-center">
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Select reconstruction</div>
              <div className="selector__body">

                <List
                  block
                  list={etypes}
                  value={currentEtype}
                  title="e-type"
                  color={colorName}
                  onSelect={setEtype}
                  theme={theme}
                />
                <List
                  block
                  list={instances}
                  value={currentInstance}
                  title={`Experiment instance (${instances.length})`}
                  color={colorName}
                  onSelect={setInstance}
                  anchor="data"
                  theme={theme}
                />

              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        visible={!!currentInstance}
        navItems={[
          { id: 'instanceSection', label: 'Instance' },
          { id: 'etypeSection', label: 'Population' },
        ]}
      >
        <Collapsible
          id="instanceSection"
          title={`Electrophysiological Recordings for ${currentEtype}_${currentInstance}`}
        >
          <p className="mb-4">We provide visualization and features for the selected recording.</p>

          <ESData query={fullElectroPhysiologyDataQueryObj}>
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <>
                    <Metadata nexusDocument={esDocuments[0]._source} />
                    <h3 className="mt-3">Patch clamp recording</h3>
                    <div className="flex justify-between items-center mt-2 mb-2">
                      <div>
                        <Button
                          className="mr-1"
                          type="dashed"
                          icon={<QuestionCircleOutlined />}
                          href={`${basePath}/tutorials/nwb/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                        >
                          How to read NWB files
                        </Button>
                        <NexusFileDownloadButton
                          filename={getEphysDistribution(esDocuments[0]._source).name}
                          url={getEphysDistribution(esDocuments[0]._source).contentUrl}
                          org={hippocampus.org}
                          project={hippocampus.project}
                          id="ephysDownloadBtn"
                        >
                          trace
                        </NexusFileDownloadButton>
                      </div>
                    </div>
                    <NexusPlugin
                      name="neuron-electrophysiology"
                      resource={esDocuments[0]._source}
                      nexusClient={nexus}
                    />
                    <div className="text-right">
                      <Button
                        className="mr-1"
                        type="primary"
                        size="small"
                        href={`${deploymentUrl}/build/data/electrophysiology?query=${encodeURIComponent(currentInstance)}`}
                      >
                        Send to the Build section
                      </Button>
                    </div>
                    <div className="mt-3">
                      <TraceRelatedMorphologies trace={esDocuments[0]._source} />
                    </div>
                  </>
                )}
              </>
            )}
          </ESData>
          <IfCurvePerCellGraph instance={currentInstance} />
        </Collapsible>

        <Collapsible
          id="etypeSection"
          className="mt-4"
          title="Population"
        >
          <p className="mb-4">We provide features for the entire e-type group selected.</p>

          <ESData query={etypeTracesDataQueryObj}>
            {esDocuments => (
              <>
                {!!esDocuments && (
                  <ExpTraceTable
                    etype={currentEtype}
                    traces={getAndSortTraces(esDocuments)}
                    currentTrace={currentInstance}
                  />
                )}
              </>
            )}
          </ESData>
          <IfCurvePerETypeGraph eType={currentEtype} />
        </Collapsible>
      </DataContainer>
    </>
  );
};

const hocPreselection = withPreselection(
  NeuronElectrophysiology,
  {
    key: 'etype',
    defaultQuery: defaultSelection.experimentalData.neuronElectrophysiology,
  },
);

const qsEntries = [
  {
    title: 'E-type',
    key: 'etype',
    values: getEtype(),
  },
  {
    title: 'Instance',
    key: 'etype_instance',
    getValuesFn: getInstance,
    getValuesParam: 'etype',
    paramsToKeepOnChange: ['etype'],
  },
];

export default withQuickSelector(
  hocPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);