import React, { useState } from 'react';
import { Row, Col, Spin, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VolumeViewer from './volume/volume-viewer'; // Ensure this path is correct
import CoordinatesViewer from './volume/coordinates-viewer/CoordinatesViewer'; // Ensure this path is correct

import { staticDataBaseUrl } from '@/config';
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
import withQuickSelector from '@/hoc/with-quick-selector';

import selectorStyle from '@/styles/selector.module.scss';
import { VolumeSection } from '@/types';
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

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <Row className="w-100" gutter={[0, 20]}>
          <Col className="mb-2" xs={24} lg={12}>
            <StickyContainer>
              <Title primaryColor={colorName} title="Volume" subtitle="Reconstruction Data" theme={theme} />
              <div role="information">
                <InfoBox>
                  <p>
                    We combined a publicly available <Link href="http://cng.gmu.edu/hippocampus3d/" className={`link theme-${theme}`}>atlas</Link> with a process of coordinate extraction and <Link href="/experimental-data/layer-anatomy/  " className={`link theme-${theme}`}>layer thickness estimation</Link> to reconstruct the volume of CA1. From the entire CA1, we can obtain subvolumes of particular interest, such as cylinders and slices, at any desired location.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </Col>
          <Col
            className={`set-accent-color--${'grey'} mb-2`}
            xs={24}
            lg={12}
          >
            <div className={selectorStyle.row}>
              <div className={"selector__column mt-3 theme-" + theme}>
                <div className={"selector__head theme-" + theme}>Select a volume section</div>
                <div className={"selector__body"}>
                  <VolumeSectionSelector3D
                    value={volumeSection}
                    onSelect={setVolumeSectionQuery}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer theme={theme} navItems={[
        { id: 'volumeSection', label: 'Volume' },
        { id: 'vectorsSection', label: 'Vectors' },
        { id: 'coordinatesSection', label: 'Coordinates' }
      ]}>
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
              <VolumeViewer meshPath={`${staticDataBaseUrl}/rec-data/volume/volume.obj`} volumeSection={volumeSection} onReady={() => setVolumeViewerReady(true)} />
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

        <Collapsible id="vectorsSection" title="Vectors" className="mt-4">
          <p>We define a series of vectors that are aligned to the hippocampal axes (longitudinal, transverse, radial). They are useful to correctly place the single cell models into the volume.</p>

        </Collapsible>

        <Collapsible id="coordinatesSection" title="Coordinates" className="mt-4">
          <p>Due to its curvature and irregularities, the volume of CA1 is difficult to manipulate. For this reason, we define a coordinate system that follows the hippocampal axes (longitudinal, transverse, radial).</p>
          <div className="graph no-padding">
            <Spin spinning={!volumeViewerReady}>
              <CoordinatesViewer />
            </Spin>
          </div>
        </Collapsible>
      </DataContainer >
    </>
  );
};


const VolumeViewWithPreselection = withPreselection(
  VolumeView,
  {
    key: 'volume_section',
    defaultQuery: defaultSelection.reconstructionData.volume,
  },
);

const qsEntries = [{
  title: 'Volume section',
  key: 'volume_section',
  values: volumeSections,
}];


export default withQuickSelector(
  VolumeViewWithPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);
