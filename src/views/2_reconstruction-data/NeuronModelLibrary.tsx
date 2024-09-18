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

import models from './neuron-model-libraries.json';
import { defaultSelection } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import { colorName } from './config';
import HttpData from '@/components/HttpData';
import { dataPath } from '@/config';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import ModelFactsheet from './components/ModelFactsheet';
import TraceGraph from '../5_predictions/components/Trace';

const getMtypes = (): string[] => {
  return Array.from(new Set(models.map(model => model.mtype))).sort();
};

const getEtypes = (mtype: string): string[] => {
  return Array.from(new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))).sort();
};

const Neurons: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentMtype, setCurrentMtype] = useState<string>('');
  const [currentEtype, setCurrentEtype] = useState<string>('');
  const [traceData, setTraceData] = useState<any>(null);

  const mtypes = getMtypes();
  const etypes = getEtypes(currentMtype);

  useEffect(() => {
    if (query.mtype && typeof query.mtype === 'string' && mtypes.includes(query.mtype)) {
      setCurrentMtype(query.mtype);
    } else if (mtypes.length > 0) {
      setCurrentMtype(mtypes[0]);
    }
  }, [query.mtype, mtypes]);

  useEffect(() => {
    if (currentMtype) {
      const availableEtypes = getEtypes(currentMtype);
      if (query.etype && typeof query.etype === 'string' && availableEtypes.includes(query.etype)) {
        setCurrentEtype(query.etype);
      } else if (availableEtypes.length > 0) {
        setCurrentEtype(availableEtypes[0]);
      } else {
        setCurrentEtype('');
      }
    }
  }, [query.etype, currentMtype]);

  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  const setMtype = (mtype: string) => {
    setParams({
      mtype,
      etype: '',
    });
  };

  const setEtype = (etype: string) => {
    setParams({
      etype,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentMtype && currentEtype) {
        try {
          const response = await fetch(`${dataPath}2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/1/trace.json`);
          const data = await response.json();
          setTraceData(data);
        } catch (error) {
          setTraceData(null);
        }
      }
    };

    fetchData();
  }, [currentEtype, currentMtype]);

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'M-type',
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
  ];

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Neuron model library"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                Initial set of single <Link className={`link theme-${theme}`} href="/reconstruction-data/neuron-models">cell models</Link> are combined with the <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphology library</Link> to produce a library of neuron models.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
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
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        navItems={[
          { id: 'traceSection', label: 'Trace' },
          { id: 'factsheetSection', label: 'Factsheet' },
          { id: 'bPAPPSPSection', label: 'bPAP & PSP' }
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="traceSection"
          className="mt-4"
          title="Trace"
        >
          <div className="graph">
            <TraceGraph plotData={traceData} />
          </div>
          <div className="mt-4">
            <DownloadButton onClick={() => downloadAsJson(traceData, `${currentMtype}-${currentEtype}-trace.json`)} theme={theme}>
              Trace data
            </DownloadButton>
          </div>
        </Collapsible>

        <Collapsible
          id="factsheetSection"
          className="mt-4"
          title="Factsheet"
        >
          <HttpData path={`${dataPath}2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/1/features_with_rheobase.json`}>
            {(factsheetData) => (
              <>
                {factsheetData && (
                  <>
                    <ModelFactsheet data={factsheetData} />
                    <div className="mt-4">
                      <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${currentMtype}-${currentEtype}-factsheet.json`)} theme={theme}>
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
          id="bPAPPSPSection"
          className="mt-4"
          title="bPAP & PSP"
        >
          <div className="graph">
            {/* Add bPAP & PSP graph component here */}
          </div>
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default withPreselection(
  Neurons,
  {
    key: 'mtype',
    defaultQuery: defaultSelection.digitalReconstruction.neurons,
  },
);