import React, { useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useRouter } from 'next/router';

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


const RegionView: React.FC = () => {
  const router = useRouter();

  const { volume_section: volumeSection } = router.query as { volume_section: VolumeSection };

  const setVolumeSectionQuery = (volumeSection: VolumeSection) => {
    const query = { volume_section: volumeSection };
    router.push({ query }, undefined, { shallow: true });
  };

  return (
    <>
      <Filters hasData={true}>
        <Row
          className="w-100"
          gutter={[0,20]}
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
              />
              <div role="information">
                <InfoBox>
                  <p className="text-tmp">
                    Vivamus vel semper nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                    per inceptos himenaeos. Vivamus ipsum enim, fermentum quis ipsum nec, euismod convallis leo. <br/>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    Sed vel scelerisque felis, quis condimentum felis. Pellentesque dictum neque vel mauris dignissim,
                    vitae ornare arcu sagittis. <br/>
                    Etiam vestibulum, nisi in scelerisque porta, enim est gravida mi,
                    nec pulvinar enim ligula non lorem. Aliquam ut orci est.
                    Praesent tempus sollicitudin ante varius feugiat.
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
                    value={volumeSection}
                    onSelect={setVolumeSectionQuery}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer visible={!!volumeSection}>
        <Collapsible
          id="regionSection"
          title="Region"
        >
          <p className="text-tmp">Text</p>

          <HttpData path={regionFactsheetPath(volumeSection)}>
            {(data, loading) => (
              <Spin spinning={loading}>
                {data && (
                  <div className="mt-3">
                    <h3 className="mt-3">Neuronal anatomy</h3>
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
                        href={regionFactsheetPath(volumeSection)}
                        download={`dig-rec-region-factsheet_-_${volumeSection}.json`}
                      >
                        factsheet
                      </HttpDownloadButton>
                    </div>
                  </div>
                )}
              </Spin>
            )}
          </HttpData>
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
