import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';

import ServerSideContext from '../../context/server-side-context';
import ESData from '../../components/ESData';
import DataContainer from '../../components/DataContainer';
import ImageViewer from '../../components/ImageViewer';
import NexusPlugin from '../../components/NexusPlugin';
import { electroPhysiologyDataQuery, etypeTracesDataQuery } from '../../queries/es';
import Filters from '../../layouts/Filters';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import { colorName } from './config';
import List from '../../components/List';
import ComboSelector from '../../components/ComboSelector';
import Collapsible from '../../components/Collapsible';
import ExpTraceTable from '../../components/ExpTraceTable';
import eTypes from '../../__generated__/experimentalData.json';
import { basePath } from '../../config';


const NeuronElectrophysiology: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();
  const serverSideContext = useContext(ServerSideContext);

  const query = { ...serverSideContext.query, ...router.query };

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
  const etypeData = eTypes.find(etype => etype.label === currentEtype);
  const instances = etypeData ? etypeData.experiments.map(e => e.label) : [];

  const getAndSortTraces = (esDocuments) => {
    return esDocuments
      .map(esDocument => esDocument._source)
      .sort((m1, m2) => (m1.name > m2.name) ? 1 : -1);
  };

  return (
    <>
      <Filters
        primaryColor={colorName}
        backgroundAlt
        hasData={!!currentEtype && !!currentInstance}
      >
        <div className="center-col">
          <Title
            primaryColor={colorName}
            title="Neuron Electrophysiology"
            subtitle="Experimental Data"
            hint="Select a layer of interest in the S1 of the rat brain."
          />
          <div className="mb-4">
            <InfoBox
              color={colorName}
              text="Electrical traces were recorded from neurons using whole-cell patch clamp experiments in brain slices. A standardized stimulus protocol, called the e-code, is injected in each cell. Our scientists then classify the cells based on their firing type in different electrical types (e-types)."
            />
          </div>
        </div>
        <div className="center-col">
          <ComboSelector
            selector={
              <img
                src={`${basePath}/assets/images/electroIllustration.svg`}
                alt="Electro-physiology"
                className="electro-phys-image"
              />
            }
            list1={
              <List
                title="e-type"
                list={eTypes.map(etype => etype.label)}
                color={colorName}
                onSelect={setEtype}
                value={currentEtype}
              />
            }
            list2={
              <List
                title={`Experiment instance (${instances.length})`}
                list={instances}
                color={colorName}
                onSelect={setInstance}
                value={currentInstance}
              />
            }
            listsTitle="Select cell type"
            list2Open={!!currentEtype}
            withGradient
          />
        </div>
      </Filters>

      <DataContainer visible={!!currentEtype && !!currentInstance}>
        <Collapsible title="Population">
          <h3>Factsheet</h3>
          <p>TBD</p>

          <h3 className="mt-3">Distribution</h3>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <ImageViewer src={`${basePath}/assets/images/population-distribution-1.png`} />
            </div>
            <div className="col-xs-12 col-sm-6">
              <ImageViewer src={`${basePath}/assets/images/population-distribution-2.png`} />
            </div>
          </div>

          <h3 className="mt-3">Experimental instances</h3>

          <ESData query={etypeTracesDataQuery(currentEtype)}>
            {esDocuments => (
              <>
                {!!esDocuments && (
                  <ExpTraceTable traces={getAndSortTraces(esDocuments)}/>
                )}
              </>
            )}
          </ESData>
        </Collapsible>

        <Collapsible
          className="mt-4"
          title={`Electrophysiological Recordings for ${currentEtype}_${currentInstance}`}
        >
          <ESData query={electroPhysiologyDataQuery(currentEtype, currentInstance)}>
            {esDocuments => (
              <>
                {!!esDocuments && (
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
      </DataContainer>
    </>
  );
};

export default NeuronElectrophysiology;
