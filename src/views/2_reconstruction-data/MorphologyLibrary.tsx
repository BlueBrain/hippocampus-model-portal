import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import Filters from '@/layouts/Filters';
import DataContainer from '@/components/DataContainer';
import { QuickSelectorEntry } from '@/types';
import List from '@/components/List';
import Collapsible from '@/components/Collapsible';

import models from '@/models.json';
import { defaultSelection } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import { colorName } from './config';
import NeuronFactsheet from '../1_experimental-data/neuronal-morphology/NeuronFactsheet';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import HttpData from '@/components/HttpData';
import { basePath } from '@/config';

// Function to get unique M-types
const getMtypes = (): string[] => {
  return models
    .map(model => model.mtype)
    .reduce((acc: string[], cur) => acc.includes(cur) ? acc : [...acc, cur], [])
    .sort();
}

// React Functional Component
const MorphologyLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const currentMtype: string = query.mtype as string;

  // Function to set URL parameters
  const setParams = (params: Record<string, string>): void => {
    const newQuery = {
      ...{
        mtype: currentMtype,
      },
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
  };

  // Function to set M-type
  const setMtype = (mtype: string) => {
    setParams({ mtype });
  };

  // Generate options based on current parameters
  const mtypes = getMtypes();

  // Quick selector entries
  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'M-type',
      key: 'mtype',
      values: mtypes,
      setFn: setMtype,
    },
  ];

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Morphology library"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                We scale and clone <Link className={`link theme-${theme}`} href="/experimental-data/neuronal-morphology/">morphologies</Link> to produce a morphology library.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
            <div className="selector">
              <div className={"selector__column theme-" + theme}>
                <div className={"selector__head theme-" + theme}>Select M-type</div>
                <div className={"selector__body"}>
                  <List
                    block
                    list={mtypes}
                    value={currentMtype}
                    title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                    color={colorName}
                    onSelect={setMtype}
                    theme={theme}
                    grow={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        visible={!!currentMtype}
        navItems={[
          { id: 'populationSection', label: 'Population' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="populationSection"
          title="Population"
        >
          <p className='text-lg mb-2'>
            We provide morphometrics for the entire m-type group selected.
          </p>
          <div className="mb-4">
            <HttpData path={`${basePath}/resources/data/2_reconstruction-data/morphology-library/mtype/${currentMtype}/factsheet.json`}>
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet id="morphometrics" facts={factsheetData.values} />
                      <div className="mt-4">
                        <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${currentMtype}-factsheet.json`)} theme={theme}>
                          Factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default withPreselection(
  MorphologyLibrary,
  {
    key: 'mtype',
    defaultQuery: defaultSelection.digitalReconstruction.morphologyLibrary,
  },
);