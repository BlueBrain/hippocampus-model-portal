import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import ESData from '../../components/ESData';
import DataContainer from '../../components/DataContainer';
import NexusPlugin from '../../components/NexusPlugin';
import NexusFileDownloadButton from '../../components/NexusFileDownloadButton';
import { electroPhysiologyDataQuery, etypeTracesDataQuery } from '../../queries/es';
import { deploymentUrl, hippocampus } from '../../config';
import Filters from '../../layouts/Filters';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import { colorName } from './config';
import List from '../../components/List';
import Collapsible from '../../components/Collapsible';
import ExpTraceTable from '../../components/ExpTraceTable';
import Metadata from '../../components/Metadata';
import TraceRelatedMorphologies from '../../components/TraceRelatedMorphologies';
import traces from '../../traces.json';
import { defaultSelection } from '@/constants';
import { basePath } from '../../config';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import styles from '../../styles/experimental-data/neuron-electrophysiology.module.scss';


const getEphysDistribution = (resource: any) => Array.isArray(resource.distribution)
  ? resource.distribution.find((d: any) => d.name.match(/\.nwb$/i))
  : resource.distribution;

const getEtype = () => {
  return Object.keys(traces).sort();
};

const getInstance = (etype) => {
  return etype
    ? traces[etype].sort()
    : [];
};

const NeuronElectrophysiology: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const theme = 1;

  const { query } = router;

  const setQuery = (query: any) => {
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  }

  const setEtype = (etype: string) => {
    setQuery({
      etype,
      etype_instance: null,
    });
  };
  const setInstance = (instance: string) => {
    setQuery({
      etype: currentEtype,
      etype_instance: instance,
    });
  };

  const currentEtype: string = query.etype as string;
  const currentInstance: string = query.etype_instance as string;

  const etypes = getEtype();
  const instances = getInstance(currentEtype);

  const fullElectroPhysiologyDataQueryObj = useMemo(() => {
    return electroPhysiologyDataQuery(currentEtype, currentInstance);
  }, [currentEtype, currentInstance]);

  const etypeTracesDataQueryObj = useMemo(() => {
    return etypeTracesDataQuery(currentEtype);
  }, [currentEtype]);

  const getAndSortTraces = (esDocuments) => {
    return esDocuments
      .map(esDocument => esDocument._source)
      .sort((m1, m2) => (m1.name > m2.name) ? 1 : -1);
  };

  return (
    <>
      <Filters theme={theme} hasData={!!currentInstance}>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor={colorName}
              title={<span>Neuron <br /> Electrophysiology</span>}
              subtitle="Experimental Data"
              theme={theme}
            />
            <InfoBox color="grey-1">
              <p>
                We recorded electrical traces from neurons using single-cell recording experiments in brain slices. Then, we classified the traces in different electrical types (e-types) based on their firing patterns. We identified one e-type for excitatory cells and four e-types for inhibitory cells.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-3 col-lg-offset-1">
            <div className={"selector__column theme-" + theme}>
              <div className={"selector__head theme-" + theme}>Choose a layer</div>
              <div className={"selector__body"}>
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
          <ESData query={fullElectroPhysiologyDataQueryObj} >
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <>
                    {JSON.stringify(esDocuments[0]._source)}
                    <Metadata nexusDocument={esDocuments[0]._source} />
                    <h3 className="mt-3">Patch clamp recording</h3>
                    <div className="row start-xs end-sm mt-2 mb-2">
                      <div className="col-xs">
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
        </Collapsible>

        <Collapsible
          id="etypeSection"
          className="mt-4"
          title="Population"
        >
          <h3 className="mt-3">Experimental instances</h3>
          <p>We provide features for the entire e-type group selected.</p>

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
