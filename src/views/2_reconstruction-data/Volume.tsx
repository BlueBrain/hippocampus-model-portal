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
        <Collapsible id="volume" title="Volume">
          <h2>
            {volumeSection === 'region' ? (
              <span>Region CA1</span>
            ) : volumeSection === 'cylinder' ? (
              <span>Coronal slice of 400 um from the dorsal CA1.</span>
            ) : volumeSection === 'slice' ? (
              <span>Cylindrical subvolume of radius 300 um from the dorsal CA1.</span>
            ) : null}
          </h2>

          <h3>3D volume viewer</h3>
          <Spin spinning={!volumeViewerReady}>
            <div className="graph no-padding">
              <VolumeViewer meshPath={`${basePath}/data/3d/2_reconstruction-data/volume/volume.obj`} volumeSection={volumeSection} onReady={() => setVolumeViewerReady(true)} />
            </div>
            <div className="text-right mt-2">
              <Button className="mr-2" href="https://bbp.epfl.ch/atlas#camPosition=36984.948,3938.164,5712.791&camLookat=6612.504,3938.164,5712.791&camUp=0,-1,0&srs=bbp:atlas:https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2Fallen_ccfv3_spatial_reference_system&atlas=bbp:atlas:https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2Fe2e500ec-fe7e-4888-88b9-b72425315dda&resources=bbp:atlas:https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2F20f22cc6-7ded-45bc-a2d5-9f14f3b2f6a0,bbp:atlas:https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2F64ab81de-dbcc-4461-b077-f1e009a10a22" target="_blank" rel="noopener noreferrer" icon={<EyeOutlined />} size="small" type="primary">
                CA1 in Blue Brain Atlas
              </Button>
              <HttpDownloadButton href={volumeRasterDataPath(volumeSection)} download={`rec-data-volume-raster-data_-_${volumeSection}.xz`}>
                NRRD file(s)
              </HttpDownloadButton>
            </div>
          </Spin>

          <HttpData path={volumeAnalysisPath}>
            {(data, loading) => (
              <Spin spinning={loading}>
                <div className="mt-3">
                  <h3>Volume analysis</h3>
                  {data && (
                    <>
                      <Factsheet facts={getVolumeSectionFacts(data.values)} />
                      <div className="text-right mt-2">
                        <HttpDownloadButton onClick={() => downloadAsJson(getVolumeSectionFacts(data.values), `rec-data-volume-analysis_-_${volumeSection}.json`)}>
                          factsheet
                        </HttpDownloadButton>
                      </div>
                    </>
                  )}
                </div>
              </Spin>
            )}
          </HttpData>

          <p className="mt-3">
            Related: <Link href="/experimental-data/layer-anatomy/">Experimental data - Layer anatomy</Link>
          </p>
        </Collapsible>

        <Collapsible id="coordinatesSection" title="Coordinates" className="mt-4">
          <p>Due to its curvature and irregularities, the volume of CA1 is difficult to manipulate. For this reason, we define a coordinate system that follows the hippocampal axes (longitudinal, transverse, radial).</p>
          <div className="graph no-padding flex-col">
            <Spin spinning={!volumeViewerReady}>
              <CoordinatesViewer />
            </Spin>
          </div>

        </Collapsible>
      </DataContainer>
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