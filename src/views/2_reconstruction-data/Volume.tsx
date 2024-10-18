import React, { useState } from 'react';
import { Row, Col, Spin, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VolumeViewer from './volume/volume-viewer';
import CoordinatesViewer from './volume/coordinates-viewer/CoordinatesViewer';

import { basePath } from '@/config';
import { volumeAnalysisPath, volumeRasterDataPath } from '@/queries/http';
import { downloadAsJson } from '@/utils';
import { defaultSelection, volumeSections } from '@/constants';
import HttpData from '@/components/HttpData';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import Filters from '@/layouts/Filters';
import Factsheet from '@/components/Factsheet';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import withPreselection from '@/hoc/with-preselection';

import selectorStyle from '@/styles/selector.module.scss';
import { VolumeSection, QuickSelectorEntry } from '@/types';
import { colorName } from './config';
import DownloadButton from '@/components/DownloadButton';
import NeuronFactsheet from '../1_experimental-data/neuronal-morphology/NeuronFactsheet';

const VolumeView: React.FC = () => {
  const router = useRouter();
  const theme = 2;
  const [volumeViewerReady, setVolumeViewerReady] = useState<boolean>(false);
  const { volume_section: volumeSection } = router.query as { volume_section: VolumeSection };

  const setVolumeSectionQuery = (volumeSection: VolumeSection) => {
    const query = { volume_section: volumeSection };
    router.push({ query }, undefined, { shallow: true });
  };

  const factNameR = new RegExp(volumeSection === 'region' ? 'CA1' : volumeSection, 'i');
  const getVolumeSectionFacts = (facts) => {
    return facts.filter(fact => factNameR.test(fact.name));
  }

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Volume section',
      key: 'volume_section',
      values: volumeSections,
      setFn: setVolumeSectionQuery,
    },
  ];

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Volume" subtitle="Reconstruction Data" theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We combined a publicly available <Link href="http://cng.gmu.edu/hippocampus3d/" className={`link theme-${theme}`}>atlas</Link> with a process of coordinate extraction and <Link href="/experimental-data/layer-anatomy/" className={`link theme-${theme}`}>layer thickness estimation</Link> to reconstruct the volume of CA1. From the entire CA1, we can obtain subvolumes of particular interest, such as cylinders and slices, at any desired location.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center">
            <div className={`selector__column selector__column--lg theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Choose a layer</div>
              <div className="selector__body">
                <VolumeSectionSelector3D
                  value={volumeSection}
                  onSelect={setVolumeSectionQuery}
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
          { id: 'volumeSection', label: 'Volume' },
          { id: 'coordinatesSection', label: 'Coordinates' }
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible id="volume" title="Volume" properties={[volumeSection]}>
          <h2>
            {volumeSection === 'region' ? (
              <span>Region CA1</span>
            ) : volumeSection === 'cylinder' ? (
              <span>Cylindrical subvolume of radius 300 um from the dorsal CA1.</span>
            ) : volumeSection === 'slice' ? (
              <span>Coronal slice of 400 um from the dorsal CA1.</span>
            ) : null}
          </h2>

          <h3>3D volume viewer</h3>
          <Spin spinning={!volumeViewerReady}>
            <div className="graph no-padding">
              <VolumeViewer meshPath={`${basePath}/data/3d/2_reconstruction-data/volume/volume.obj`} volumeSection={volumeSection} onReady={() => setVolumeViewerReady(true)} />
            </div>

          </Spin>


          <p className="mt-4">
            Related: <Link href="/experimental-data/layer-anatomy/">Experimental data - Layer anatomy</Link>
          </p>

          <div className="mt-12">
            <h2 className='text-lg'>Volume analysis</h2>
            <HttpData
              path={`${basePath}/data/2_reconstruction-data/volume/volume_analysis.json`}
            >
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <Factsheet facts={factsheetData.values} />
                    </>
                  )}
                  <div className="mt-4">
                    <DownloadButton onClick={() => downloadAsJson(factsheetData.values, 'volume_analysis.json')} theme={theme}> Volume analysis </DownloadButton>
                  </div>
                </>
              )}


            </HttpData>

          </div>

        </Collapsible >

        <Collapsible id="coordinatesSection" title="Coordinates" className="mt-4" properties={[volumeSection]}>
          <p>Due to its curvature and irregularities, the volume of CA1 is difficult to manipulate. For this reason, we define a coordinate system that follows the hippocampal axes (longitudinal, transverse, radial).</p>
          <div className="graph no-padding flex-col">
            <Spin spinning={!volumeViewerReady}>
              <CoordinatesViewer />
            </Spin>
          </div>

        </Collapsible>
      </DataContainer >
    </>
  );
};

export default withPreselection(
  VolumeView,
  {
    key: 'volume_section',
    defaultQuery: defaultSelection.reconstructionData.volume,
  },
);