import React from 'react';
import dynamic from 'next/dynamic';
import { Row, Col } from 'antd';
import { useRouter } from 'next/router';

import { VolumeSection } from '@/types';
import { defaultSelection, volumeSections } from '@/constants';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import VolumeSectionSelector from '@/components/VolumeSectionSelector';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import CellCompositionTable from './cell-composition/CellCompositionTable';
import MECompositionTable from './cell-composition/MECompositionTable';
import { colorName } from './config';

import selectorStyle from '@/styles/selector.module.scss';


const CellCompositionView: React.FC = () => {
  const router = useRouter();

  const theme = 2;

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
                title="Cell composition"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We combined information on available morphological reconstructions [hyperlink], electrophysiological recordings [hyperlink], cell density [hyperlink], volume [hyperlink], and the estimation from Bezaire and Soltesz (2013) [hyperlink] to predict the number of neuron types.
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

      <DataContainer
        navItems={[
          { id: 'cellCompositionSection', label: 'Cell composition' },
          { id: 'MECompositionSection', label: 'ME-composition' },
        ]}
      >
        <Collapsible
          id="cellCompositionSection"
          title="Cell composition"
        >
          <p className="mb-3">
            Density and number of cells for each morphological type (m-type).
          </p>

          <CellCompositionTable volumeSection={volumeSection} />
        </Collapsible>

        <Collapsible
          className="mt-4"
          id="MECompositionSection"
          title="ME-composition"
        >
          <p className="mb-3">
            Each morphological type (m-type) can show one or more electrical types (e-types) giving rise to different morpho-electrical types (me-types).
          </p>

          <MECompositionTable />
        </Collapsible>
      </DataContainer>
    </>
  );
};

const CellCompositionViewWithPreselection = withPreselection(
  CellCompositionView,
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
  CellCompositionViewWithPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);
