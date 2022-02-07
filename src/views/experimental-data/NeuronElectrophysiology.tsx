import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import { Button } from 'antd';

import ESData from '../../components/ESData';
import DataContainer from '../../components/DataContainer';
import NexusPlugin from '../../components/NexusPlugin';
import NexusFileDownloadButton from '../../components/NexusFileDownloadButton';
import { electroPhysiologyDataQuery, etypeTracesDataQuery } from '../../queries/es';
import { hippocampus } from '../../config';
import Filters from '../../layouts/Filters';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import { colorName } from './config';
import List from '../../components/List';
import Collapsible from '../../components/Collapsible';
import ExpTraceTable from '../../components/ExpTraceTable';
import Metadata from '../../components/Metadata';
import traces from '../../traces.json';

import styles from '../../styles/experimental-data/neuron-electrophysiology.module.scss';


const getEphysDistribution = (resource: any) => Array.isArray(resource.distribution)
  ? resource.distribution.find((d: any) => d.name.match(/\.nwb$/i))
  : resource.distribution;

const NeuronElectrophysiology: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const query = {
    ...router.query
  };

  const setQuery = (query: any) => {
    router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
  }

  const setEtype = (etype: string) => {
    setQuery({
      etype,
      etype_instance: currentInstance,
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

  const etypes = Object.keys(traces).sort();
  const instances = currentEtype
    ? traces[currentEtype].sort()
    : []

  const getAndSortTraces = (esDocuments) => {
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
              title={<span>Neuron <br /> Electrophysiology</span>}
              subtitle="Experimental Data"
            />
            <InfoBox color="grey-1">
              <p>
                We recorded electrical traces from neurons using single-cell recording experiments
                in brain slices. Then, we classified the traces in different electrical types (e-types)
                based on their firing patterns. We have identified one e-type for excitatory cells
                and four e-types for inhibitory cells.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-4 col-lg-offset-1">
            <div className={styles.selector}>
              <div className={styles.selectorHead}>Select cell type</div>
              <div className={styles.selectorBody}>
                <List
                  list={etypes}
                  value={currentEtype}
                  title="e-type"
                  color={colorName}
                  onSelect={setEtype}
                />
                <br />
                <br />
                <br />
                <List
                  list={instances}
                  value={currentInstance}
                  title={`Experiment instance (${instances.length})`}
                  color={colorName}
                  onSelect={setInstance}
                  anchor="data"
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer visible={!!currentInstance}>
        <Collapsible
          id="instanceSection"
          title={`Electrophysiological Recordings for ${currentEtype}_${currentInstance}`}
        >
          <ESData query={electroPhysiologyDataQuery(currentEtype, currentInstance)} >
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <>
                    <Metadata nexusDocument={esDocuments[0]._source} />
                    <h3 className="mt-3">Patch clamp recording</h3>
                    <div className="row start-xs end-sm mt-2 mb-2">
                      <div className="col-xs">
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
                        href={`/build/data/electrophysiology?query=${encodeURIComponent(currentInstance)}`}
                      >
                        Send to the Build section
                      </Button>
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

          <ESData query={etypeTracesDataQuery(currentEtype)}>
            {esDocuments => (
              <>
                {!!esDocuments && (
                  <ExpTraceTable
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

export default NeuronElectrophysiology;