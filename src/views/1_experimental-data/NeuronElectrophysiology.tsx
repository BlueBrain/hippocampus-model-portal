import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import ESData from '@/components/ESData';
import DataContainer from '@/components/DataContainer';
import NexusPlugin from '@/components/NexusPlugin';
import Filters from '@/layouts/Filters';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';
import Collapsible from '@/components/Collapsible';
import TraceRelatedMorphologies from '@/components/TraceRelatedMorphologies';
import StickyContainer from '@/components/StickyContainer';
import AuthorBox from '@/components/AuthorBox/AuthorBox';
import IfCurvePerCellGraph from './neuron-electrophysiology/IfCurvePerCellGraph';
import IfCurvePerETypeGraph from './neuron-electrophysiology/IfCurvePerETypeGraph';
import { electroPhysiologyDataQuery, etypeTracesDataQuery } from '@/queries/es';
import { deploymentUrl, hippocampus, basePath, dataPath } from '@/config';
import { colorName } from './config';
import { defaultSelection } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import traces from '@/traces.json';
import { QuickSelectorEntry } from '@/types';
import HttpData from '@/components/HttpData';
import NeuronFactsheet from './neuron-electrophysiology/NeuronFactsheet';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson, downloadFile } from '@/utils';
import ExperimentalRecordingsTable from '../2_reconstruction-data/neuron-model/ExperimentalRecordingsTable';
import ElectrophysiologyTable from './neuron-electrophysiology/ElectrophysiologyTable';

type Distribution = {
  name: string;
  contentUrl: string;
};

type Resource = {
  distribution: Distribution | Distribution[];
};

const getEphysDistribution = (resource: Resource): Distribution => {
  if (Array.isArray(resource.distribution)) {
    return resource.distribution.find((d) => d.name.match(/\.nwb$/i)) || resource.distribution[0];
  }
  return resource.distribution;
};

const getEtype = (): string[] => Object.keys(traces).sort();
const getInstance = (etype: string | undefined): string[] =>
  etype && traces[etype] ? traces[etype].sort() : [];

const NeuronElectrophysiology: React.FC = () => {
  const [electrophysiologyTableData, setelectrophysiologyTableData] = useState<any>(null);
  const router = useRouter();
  const nexus = useNexusContext();
  const theme = 1;
  const { query } = router;

  const setQuery = useCallback((newQuery: Record<string, string | undefined>) => {
    router.push(
      { query: { ...query, ...newQuery }, pathname: router.pathname },
      undefined,
      { shallow: true }
    );
  }, [query, router]);

  const setEtype = useCallback((etype: string) => {
    const newInstances = getInstance(etype);
    const firstInstance = newInstances.length > 0 ? newInstances[0] : undefined;
    setQuery({ etype, etype_instance: firstInstance });
  }, [setQuery]);

  const setInstance = useCallback((instance: string) => {
    setQuery({ etype_instance: instance });
  }, [setQuery]);

  const currentEtype = typeof query.etype === 'string' ? query.etype : undefined;
  const currentInstance = typeof query.etype_instance === 'string' ? query.etype_instance : undefined;

  const etypes = useMemo(() => getEtype(), []);
  const instances = useMemo(() => getInstance(currentEtype), [currentEtype]);

  const fullElectroPhysiologyDataQueryObj = useMemo(
    () => currentEtype && currentInstance ? electroPhysiologyDataQuery(currentEtype, currentInstance) : null,
    [currentEtype, currentInstance]
  );

  const etypeTracesDataQueryObj = useMemo(
    () => currentEtype ? etypeTracesDataQuery(currentEtype) : null,
    [currentEtype]
  );

  const qsEntries: QuickSelectorEntry[] = useMemo(() => [
    {
      title: 'E-type',
      key: 'etype',
      values: etypes,
      setFn: setEtype,
    },
    {
      title: 'Instance',
      key: 'etype_instance',
      values: instances,
      setFn: setInstance,
    },
  ], [etypes, instances, setEtype, setInstance]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentInstance) return;

      try {
        const response = await fetch(
          `${dataPath}/1_experimental-data/neuronal-electophysiology/efeatures-per-etype/${currentEtype}/electropysiology-table.json`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const experimentalRecordingData = await response.json();
        setelectrophysiologyTableData(experimentalRecordingData);
      } catch (error) {
        console.error('Error fetching experimental recording data:', error);
        setelectrophysiologyTableData(null);
      }
    };

    fetchData();
  }, [currentEtype]);

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
        quickSelectorEntries={qsEntries}
      >
        <div className="data-container" />
        <Collapsible
          id="instanceSection"
          properties={[currentEtype, currentInstance]}
          title={`Electrophysiological Recordings`}
        >
          <AuthorBox>
            Alex Thomson: supervision, Audrey Mercer: supervision, University College London.
          </AuthorBox>
          <p className="mt-4 ">We provide visualization and features for the selected recording.</p>
          <ESData query={fullElectroPhysiologyDataQueryObj}>
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <>
                    <h3 className="mt-3  mb-2">Patch clamp recording</h3>

                    <NexusPlugin
                      name="neuron-electrophysiology"
                      resource={esDocuments[0]._source}
                      nexusClient={nexus}
                    />

                    <div className="flex flex-row gap-4">
                      <DownloadButton onClick={() => downloadFile(`${dataPath}/1_experimental-data/neuronal-electophysiology/nwb/${currentInstance}.nwb`, `${currentInstance}.nwb`)} theme={theme}>
                        Trace
                      </DownloadButton>
                      <DownloadButton theme={theme} buildIcon={true} href={`${deploymentUrl}/build/data/electrophysiology?query=${encodeURIComponent(currentInstance || '')}`}>
                        Send to the Build section
                      </DownloadButton>
                    </div>

                    <div className="mt-3">
                      <TraceRelatedMorphologies trace={esDocuments[0]._source} />
                    </div>
                  </>
                )}
              </>
            )}
          </ESData>
          <IfCurvePerCellGraph theme={theme} instance={currentInstance} />
          <div className="mb-4">
            <HttpData path={`${dataPath}/1_experimental-data/neuronal-electophysiology/efeatures-per-cell/${currentInstance}/features.json`}>
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet id="morphometrics" facts={factsheetData} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(factsheetData, `${currentEtype}-factsheet.json`)} theme={theme}>
                          Instance factsheet
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
          id="etypeSection"
          className="mt-4"
          title="Population"
          properties={[currentEtype]}
        >
          <p className="mb-4">We provide features for the entire e-type group selected.</p>
          {currentEtype && (
            <IfCurvePerETypeGraph theme={theme} eType={currentEtype} />
          )}
          <div className="mb-4">
            <HttpData path={`${dataPath}/1_experimental-data/neuronal-electophysiology/efeatures-per-etype/${currentEtype}/features.json`}>
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet id="morphometrics" facts={factsheetData} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${currentEtype}-factsheet.json`)} theme={theme}>
                          Population factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>

          {<ElectrophysiologyTable data={electrophysiologyTableData} />}

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

export default hocPreselection;