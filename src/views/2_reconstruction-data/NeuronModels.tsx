import React, { useEffect, useState } from 'react';
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
import { dataPath } from '@/config';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import TraceGraph from '../5_predictions/components/Trace';
import Factsheet from '@/components/Factsheet';

// Import the models data
import modelsData from './neuron-model.json';

const getEtypes = (): string[] => {
  return Array.from(new Set(modelsData.map(model => model.etype))).sort();
};

const getInstances = (etype: string): string[] => {
  return modelsData.filter(model => model.etype === etype).map(model => model.instance);
};

const Neurons: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentEtype, setCurrentEtype] = useState<string>('');
  const [currentInstance, setCurrentInstance] = useState<string>('');
  const [traceData, setTraceData] = useState<any>(null);

  const etypes = getEtypes();
  const instances = getInstances(currentEtype);

  useEffect(() => {
    if (query.etype && typeof query.etype === 'string' && etypes.includes(query.etype)) {
      setCurrentEtype(query.etype);
    } else if (etypes.length > 0) {
      setCurrentEtype(etypes[0]);
    }
  }, [query.etype, etypes]);

  useEffect(() => {
    if (currentEtype) {
      const availableInstances = getInstances(currentEtype);
      if (query.instance && typeof query.instance === 'string' && availableInstances.includes(query.instance)) {
        setCurrentInstance(query.instance);
      } else if (availableInstances.length > 0) {
        setCurrentInstance(availableInstances[0]);
      } else {
        setCurrentInstance('');
      }
    }
  }, [query.instance, currentEtype]);

  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setEtype = (etype: string) => {
    setParams({
      etype,
      instance: '',
    });
  };

  const setInstance = (instance: string) => {
    setParams({
      instance,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentEtype && currentInstance) {
        try {
          const response = await fetch(`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/trace.json`);
          const data = await response.json();
          setTraceData(data);
        } catch (error) {
          console.error('Error fetching trace data:', error);
          setTraceData(null);
        }
      }
    };

    fetchData();
  }, [currentEtype, currentInstance]);

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'E-Type',
      key: 'etype',
      values: etypes,
      setFn: setEtype,
    },
    {
      title: 'Instances',
      key: 'instance',
      values: instances,
      setFn: setInstance,
    },
  ];

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              primaryColor={colorName}
              title="Neuron models"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                Starting from a subset of <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphological reconstructions</Link>, we develop an initial set of single cell models by optimizing model parameters against a set of features extracted from <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-electrophysiology/">electrophysiological recordings</Link>.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
            <div className="selector">
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>Select reconstruction</div>
                <div className="selector__body">
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
                    list={instances}
                    value={currentInstance}
                    title={`E-type instance ${instances.length ? `(${instances.length})` : ''}`}
                    color={colorName}
                    onSelect={setInstance}
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
        navItems={[
          { id: 'traceSection', label: 'Trace' },
          { id: 'bPAPPSPSection', label: 'bPAP & PSP' },
          { id: 'factsheetSection', label: 'Factsheet' }

        ]}
        quickSelectorEntries={qsEntries}
      >

        <Collapsible
          id="traceSection"
          className="mt-4"
          title="Trace"
        >
          <div className="graph">
            {traceData && <TraceGraph plotData={traceData} />}
          </div>
          {traceData && (
            <div className="mt-4">
              <DownloadButton onClick={() => downloadAsJson(traceData, `${currentEtype}-${currentInstance}-trace.json`)} theme={theme}>
                Trace data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        <Collapsible
          id="bPAPPSPSection"
          className="mt-4"
          title="bPAP & PSP"
        >
          <div className="graph">
            {/* Add bPAP & PSP graph component here */}
          </div>
        </Collapsible>

        <Collapsible
          id="factsheetSection"
          className="mt-4"
          title="Factsheet"
        >
          <HttpData path={`${dataPath}2_reconstruction-data/neuron-models/${currentInstance}/features_with_rheobase.json`}>
            {(factsheetData) => (
              <>
                {factsheetData && (
                  <>
                    <Factsheet facts={factsheetData} />
                    <div className="mt-4">
                      <DownloadButton onClick={() => downloadAsJson(factsheetData, `${currentEtype}-${currentInstance}-factsheet.json`)} theme={theme}>
                        Factsheet
                      </DownloadButton>
                    </div>
                  </>
                )}
              </>
            )}
          </HttpData>
        </Collapsible>


      </DataContainer>
    </>
  );
};

export default withPreselection(
  Neurons,
  {
    key: 'etype',
    defaultQuery: defaultSelection.digitalReconstruction.neurons,
  },
);