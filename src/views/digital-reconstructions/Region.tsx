import React, { useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useRouter } from 'next/router';

import { staticDataBaseUrl } from '@/config';
import { colorName } from './config';
import Filters from '@/layouts/Filters';
import { regionFactsheetPath } from '@/queries/http';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import Factsheet from '@/components/Factsheet';
import HttpData from '@/components/HttpData';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import { VolumeSection } from '@/types';
import { defaultSelection, volumeSections } from '@/constants';
import VolumeSectionSelector from '@/components/VolumeSectionSelector';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import selectorStyle from '@/styles/selector.module.scss';

import RegionViewer from './region/region-viewer/RegionViewer';

const RegionView: React.FC = () => {
  const router = useRouter();
  const theme = 3;
  const { volume_section: volumeSection } = router.query as { volume_section: VolumeSection | undefined };

  const [isViewerReady, setIsViewerReady] = useState(false);

  const setVolumeSectionQuery = (volumeSection: VolumeSection) => {
    const query = { volume_section: volumeSection };
    router.push({ query }, undefined, { shallow: true });
  };

  const validVolumeSection: VolumeSection = volumeSection ?? defaultSelection.digitalReconstruction.region.volume_section as VolumeSection;

  if (!validVolumeSection) {
    return null; // Or handle this case appropriately
  }

  function setVolumeViewerReady(isReady: boolean): void {
    setIsViewerReady(isReady);
    console.log(`Volume viewer ready: ${isReady}`);
  }

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <Row
          className="w-100"
          gutter={[0, 20]}
        >
          <Col
            className="mb-2"
            xs={24}
            lg={12}
          >
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Region"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Reconstruction data are combined to produce an instance of the CA1 network model.
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
            <div className={selectorStyle.row} style={{ maxWidth: '26rem' }}>
              <div className={`${selectorStyle.column} mt-3`}>
                <div className={selectorStyle.head}>Select a volume section</div>
                <div className={selectorStyle.body}>
                  <VolumeSectionSelector
                    value={validVolumeSection}
                    onSelect={setVolumeSectionQuery}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer theme={theme} visible={!!volumeSection}>
        <Collapsible
          id="regionSection"
          title="Factsheet"
        >
          <h3>
            {validVolumeSection === 'region' ? (
              <span>Region CA1. The image shows soma positions.</span>
            ) : validVolumeSection === 'cylinder' ? (
              <span>Coronal slice of 400 um from the dorsal CA1. The image shows soma positions.</span>
            ) : validVolumeSection === 'slice' ? (
              <span> Cylindrical subvolume of radius 300 um from the dorsal CA1. The image shows soma positions.</span>
            ) : null}
          </h3>

          <div className="graph">
            <RegionViewer meshPath={`${staticDataBaseUrl}/3d/region.obj`} volumeSection={validVolumeSection} onReady={() => setVolumeViewerReady(true)} />
          </div>
          {validVolumeSection && (
            <HttpData path={regionFactsheetPath(validVolumeSection ?? '')}>
              {(data, loading) => (
                <Spin spinning={loading}>
                  {data && (
                    <>
                      <h3 className="mt-2">Neuronal anatomy</h3>
                      <Factsheet facts={data.neuronalAnatomy} />

                      <h3 className="mt-3">Neuronal physiology</h3>
                      <Factsheet facts={data.neuronalPhysiology} />

                      <h3 className="mt-3">Synaptic anatomy</h3>
                      <Factsheet facts={data.synapticAnatomy} />

                      <h3 className="mt-3">Synaptic physiology</h3>
                      <Factsheet facts={data.synapticPhysiology} />

                      <h3 className="mt-3">Network anatomy</h3>
                      <Factsheet facts={data.networkAnatomy} />

                      <h3 className="mt-3">Schaffer collaterals</h3>
                      <Factsheet facts={data.schafferCollaterals} />

                      <div className="text-right mt-2">
                        <HttpDownloadButton
                          href={regionFactsheetPath(validVolumeSection)}
                          download={`dig-rec-region-factsheet_-_${validVolumeSection}.json`}
                        >
                          factsheet
                        </HttpDownloadButton>
                      </div>
                    </>
                  )}
                </Spin>
              )}
            </HttpData>
          )}
        </Collapsible>
      </DataContainer>
    </>
  );
};

const RegionViewWithPreselection = withPreselection(
  RegionView,
  {
    key: 'volume_section',
    defaultQuery: defaultSelection.digitalReconstruction.region,
  },
);

const qsEntries = [{
  title: 'Volume section',
  key: 'volume_section',
  values: volumeSections,
}];

export default withQuickSelector(
  RegionViewWithPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);
