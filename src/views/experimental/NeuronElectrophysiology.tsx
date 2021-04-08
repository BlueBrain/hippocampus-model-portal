import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';

import ESData from '../../components/ESData';
import DataContainer from '../../components/DataContainer';
import NexusPlugin from '../../components/NexusPlugin';
import { electroPhysiologyDataQuery, etypeTracesDataQuery } from '../../queries/es';
import Filters from '../../layouts/Filters';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import { colorName } from './config';
import List from '../../components/List';
import Collapsible from '../../components/Collapsible';
import ExpTraceTable from '../../components/ExpTraceTable';
import traces from '../../traces.json';
import styles from '../../styles/experimental-data/neuron-electrophysiology.module.scss';


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
      <Filters
        backgroundAlt
      >
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor={colorName}
              title={<span>Neuron <br /> Electrophysiology</span>}
              subtitle="Experimental Data"
            />
            <InfoBox
              color="grey-1"
              text="We recorded electrical traces from neurons using single-cell recording experiments in brain slices. Then, we classified the traces in different electrical types (e-types) based on their firing patterns. We have identified one e-type for excitatory cells and four e-types for inhibitory cells."
            />
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

      <div id="data" />

      {!!currentEtype && !!currentInstance && <DataContainer>
        <Collapsible title={`Electrophysiological Recordings for ${currentEtype}_${currentInstance}`}>
          <ESData query={electroPhysiologyDataQuery(currentEtype, currentInstance)} >
            {esDocuments => (
              <>
                {!!esDocuments && !!esDocuments.length && (
                  <NexusPlugin
                    name="neuron-electrophysiology"
                    resource={esDocuments[0]._source}
                    nexusClient={nexus}
                  />
                )}
              </>
            )}
          </ESData>
        </Collapsible>

        <Collapsible title="Population" className="mt-4">
          <h3 className="mt-3">Experimental instances</h3>

          <ESData query={etypeTracesDataQuery(currentEtype)}>
            {esDocuments => (
              <>
                {!!esDocuments && (
                  <ExpTraceTable traces={getAndSortTraces(esDocuments)} />
                )}
              </>
            )}
          </ESData>
        </Collapsible>
      </DataContainer>
      }
    </>
  );
};

export default NeuronElectrophysiology;
